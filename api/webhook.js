// api/webhook.js — Telegram bot on Vercel (Node 18, CommonJS)
const { Telegraf, Markup, webhookCallback } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN, { handlerTimeout: 9000 });
const CHANNEL = process.env.PUBLIC_CHANNEL;

// /start
bot.start((ctx) =>
  ctx.reply(
    'Бот готов. Натисни кнопку — перевіримо пост у канал.',
    Markup.inlineKeyboard([[Markup.button.callback('📣 Тест поста в канал', 'testpost')]])
  )
);

// тест поста
bot.action('testpost', async (ctx) => {
  try {
    await ctx.answerCbQuery('Шлю пост у канал…');
    await ctx.telegram.sendMessage(CHANNEL, '✅ Тест: бот може постити в канал.');
    await ctx.reply('Готово. Пост має з’явитися у каналі.');
  } catch (e) {
    console.error('send error:', e);
    await ctx.reply('❌ Перевір, що бот — адмін каналу і PUBLIC_CHANNEL = @handle.');
  }
});

// официальный обработчик Telegraf для вебхуков
const handle = webhookCallback(bot, 'http');

module.exports = async (req, res) => {
  if (req.method === 'GET') return res.status(200).send('OK'); // проверка живости
  try {
    await handle(req, res);
  } catch (e) {
    console.error('webhook error:', e);
    res.status(200).send('OK');
  }
};
