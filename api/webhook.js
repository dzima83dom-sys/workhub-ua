// api/webhook.js — Telegram webhook on Vercel (Node 18, CommonJS)
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHANNEL = process.env.PUBLIC_CHANNEL;

// test command
bot.start((ctx) =>
  ctx.reply(
    'Бот готов. Натисни кнопку — перевіримо пост у канал.',
    Markup.inlineKeyboard([[ Markup.button.callback('📣 Тест поста в канал', 'testpost') ]])
  )
);

bot.action('testpost', async (ctx) => {
  try {
    await ctx.answerCbQuery('Шлю пост у канал…');
    await ctx.telegram.sendMessage(CHANNEL, '✅ Тест: бот може постити в канал.');
    await ctx.reply('Готово. Пост має з’явитися у каналі.');
  } catch (e) {
    console.error('send error', e);
    await ctx.reply('❌ Перевір, що бот — адмін каналу і PUBLIC_CHANNEL = @handle.');
  }
});

// helper: safe body parse (на всякий)
async function getBody(req) {
  if (req.body) return req.body;
  return await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method === 'GET') return res.status(200).send('OK');

  try {
    const update = await getBody(req);
    console.log('update:', JSON.stringify(update)); // видно в Vercel → Runtime Logs
    await bot.handleUpdate(update);
  } catch (e) {
    console.error('webhook error', e);
  }
  res.status(200).send('OK');
};
