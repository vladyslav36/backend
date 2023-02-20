const User = require("./models/userModel")
const jwt = require("jsonwebtoken")
const TelegramBot = require("node-telegram-bot-api")
const viberBot = require("viber-bot").Bot
const botEvents = require("viber-bot").Events
const TextMessage = require("viber-bot").Message.Text
const FileMessage = require("viber-bot").Message.File

exports.tBotHandler = (io) => {
  const telegramToken = process.env.TELEGRAM_TOKEN
  const tBot = new TelegramBot(telegramToken, {
    polling: true,
  })

  tBot.onText(/\/start (.+)/, async (msg, match) => {
    const userId = msg.chat.id
    const authKey = match[1]
    const userName = msg.from.first_name

    try {
      let user = await User.findOne({ userId })
      if (!user) {
        user = await User.create({
          authKey,
          userId,
          userName,
          authMethod: "Telegram",
        })
      }
      const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: "60d",
      })

      await user.updateOne({ token, authKey })

      tBot.sendMessage(
        userId,
        `Привет ${msg.from.first_name}. Вы успешно авторизировались на сайте Karmen`
      )
      io.emit("authkey", authKey)
    } catch (error) {
      console.log(`Ошибка при авторизации в телеграм. ${error.message}`)
    }
  })
  return tBot
}

exports.vBotHandler = (io) => {
  const vBot = new viberBot({
    authToken: process.env.VIBER_TOKEN,
    name: process.env.VIBER_NAME,
    avatar: "/upload/logo.png",
  })
  vBot
    .setWebhook(`${process.env.API_URL}/viber/webhook`)
    .then(() => console.log("Viber-Bot connected"))
    .catch((error) => console.log(`This is error ${error.message}`))

  vBot.onConversationStarted(
    async (userProfile, isSubscribed, authKey = context, onFinish) => {
      try {
        let user = await User.findOne({ userId: userProfile.id })
        
        if (!user) {
          user = await User.create({
            authKey,
            userId: userProfile.id,
            userName: userProfile.name,
            authMethod: "Viber",
          })
          
        }
        
        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
          expiresIn: "60d",
        })
        await user.updateOne({ token, authKey })
        vBot.sendMessage(
          userProfile,
          new TextMessage(
            `Привет ${userProfile.name}, вы успешно авторизировались на сайте Karmen`
          )
        )
        if (!isSubscribed) {
          vBot.sendMessage(
            userProfile,
            new TextMessage(
              `Для получения сообщений о состоянии заказа отправьте любое сообщение этому боту`
            )
          )
        }
        io.emit("authkey", authKey)
      } catch (error) {
        console.log(`Ошибка при авторизации в Viber. ${error.message}`)
      }
    }
  )
  return vBot
}
