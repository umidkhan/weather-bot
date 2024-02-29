const cron = require("node-cron");
const axios = require("axios");

const task = cron.schedule("*/10 * * * *", async () => {
  try {
    const respone = await axios.post(process.env.WEBHOOK_URI);
    console.log(`POST request sent: ${respone.data}`);
  } catch (err) {
    console.error("!ERROR: " + err);
  }
});

module.exports = task;
