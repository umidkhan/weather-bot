const { Telegraf } = require("telegraf");
const axios = require("axios");
require("dotenv").config();

const bot = new Telegraf(process.env.TOKEN);
const apiKey = process.env.API_KEY;
const api = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=`;

bot.start((ctx) => {
  ctx.reply(
    `Welcome to the bot [${ctx.from.first_name}](tg://user?id=${ctx.from.id})\nI can send a weather data of any city\nPlease enter the name of the city`,
    { parse_mode: "Markdown" }
  );
});

bot.command("about", (ctx) => {
  ctx.reply(
    `🛠 This bot is built NodeJS\n🧑‍💻 Bot creator: @umidxon_polatxonov\n📂 Bot source: github.com/umidkhan/github-user-finder-bot`
  );
});

bot.on("text", async (ctx) => {
  ctx.react("👌");
  const text = ctx.msg.text;
  const firstName = ctx.from.first_name;
  setTimeout(() => {
    ctx.telegram.sendMessage(
      process.env.CHAT_ID,
      `@umidxon_weather_bot\n<a href="tg://user?id=${ctx.from.id}">${firstName}</a> | @${ctx.from.username} wrote ${ctx.msg.text}`,
      { parse_mode: "HTML" }
    );
  }, 60000);

  axios
    .get(api + text)
    .then(async (res) => {
      const current = res.data.current;
      const weatherText = current.condition.text;
      const weatherPhoto = `https:${current.condition.icon}`;
      const weatherSpeed = current.wind_kph;
      const location = res.data.location;

      await ctx.replyWithPhoto(weatherPhoto, {
        caption: `<b>Location:</b> ${location.name}\n<b>Location country:</b> ${location.country}\n<b>Region or state:</b> ${location.region}\n<b>Condition:</b> ${weatherText}\n<b>Temperature:</b> ${current.temp_c}°C\n<b>Wind speed:</b> ${weatherSpeed}kph\n<b>Cloud cover:</b> ${current.cloud}%\n<b>Humidity:</b> ${current.humidity}%\n\n<b>By <i>@umidxon_weather_bot</i></b>`,
        parse_mode: "HTML",
      });
    })
    .catch((err) => {
      ctx.reply("No information found\nCheck and try again 🙁");
    });
});

bot.on("message", (ctx) => ctx.reply("Please, send only text message"));

bot.launch(() => {
  console.log("Bot started!");
});

module.exports = bot;
