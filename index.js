require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHANNEL = process.env.PUBLIC_CHANNEL;

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

bot.launch().then(()=>console.log('Bot started'));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
