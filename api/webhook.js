// Telegram webhook на Vercel (Node.js 18, CommonJS)
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHANNEL = process.env.PUBLIC_CHANNEL;

// тестовая команда
bot.start((ctx) =>
  ctx.reply(
    'Бот готов. Натисни кнопку — перевіримо пост у канал.',
    Markup.inlineKeyboard([[Markup.button.callback('📣 Тест поста в канал', 'testpost')]])
  )
);

bot.action('testpost', async (ctx) => {
  try {
    await ctx.answerCbQuery('Шлю пост у канал…');
    await ctx.telegram.sendMessage(CHANNEL, '✅ Тест: бот може постити в канал.');
    await ctx.reply('Готово. Пост має з’явитися у каналі.');
  } catch (e) {
    await ctx.reply('❌ Перевір, що бот — адмін каналу і PUBLIC_CHANNEL = @handle.');
    console.error(e);
  }
});

// Сам обработчик Vercel (GET вернёт OK, POST обрабатываем апдейти)
module.exports = async (req, res) => {
  if (req.method === 'GET') return res.status(200).send('OK');
  try {
    await bot.handleUpdate(req.body);
  } catch (e) {
    console.error('webhook error', e);
  }
  res.status(200).send('OK');
};

