const { Telegraf } = require('telegraf');
require('dotenv').config();
const api = require('covid19-api');
const markUp = require('telegraf/markup');
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply(
    `Hello, ${ctx.message.from.first_name}
    find out the statistic, type any country from the list and 
    quickly get information.
    Type /help to see available countries.
`,
    markUp
      .keyboard([
        ['US', 'Russia'],
        ['UK', 'Uzbekistan'],
      ])
      .resize()
      .extra()
  )
);
bot.help((ctx) => ctx.reply(COUNTRIES_LIST));
bot.on('text', async (ctx) => {
  let data = {};
  try {
    data = await api.getReportsByCountries(ctx.message.text);
    const formatData = `
    Country ${data[0][0].country},
    Cases: ${data[0][0].cases},
    Deaths: ${data[0][0].deaths},
    Recovered: ${data[0][0].recovered}
    `;
    ctx.reply(formatData);
  } catch (e) {
    ctx.reply('Error, no such country');
  }
});
bot.launch();
