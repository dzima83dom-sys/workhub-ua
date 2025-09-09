// api/webhook.js — Telegram bot на Vercel (webhook)
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHANNEL = process.env.PUBLIC_CHANNEL;

// простой тест
bot.start((ctx) =>
  ctx.reply(
    'Бот готов. Натисни кнопку — перевіримо пост у канал.',
    Markup.inlineKeyboard([[Markup.button.callback('📣 Тест поста в канал','testpost')]])
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

// Экспорт обработчика для Vercel
module.exports = async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
  } catch (e) {
    console.error('webhook error', e);
  }
  res.status(200).send('OK');
};
