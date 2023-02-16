// const nodemailer = require("nodemailer")
// const asyncHandler=require('express-async-handler')
// const User = require("../models/userModel")
// const TextMessage=require('viber-bot').Message.Text



// exports.sendMail =asyncHandler((req, res) => {
//   const { mailString } = req.body 
//     const user = process.env.MAILUSER
//     const pass=process.env.MAILPASS
//     const mail = async () => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.ukr.net",
//     port: 465,
//     secure: true,     
//     auth: {
//       user,
//       pass,
//     },
//   })
      
//       const info = await transporter.sendMail({
//         from: user,
//         to: "vladyslav36@gmail.com",
//         subject: "Заказ",        
//         html: mailString,
//       })
      
  
//     }
//   mail()
  
//     res.status(200).json({message:'Письмо успешно отправлено'})
  
// }
// )

// exports.confirmOrder = asyncHandler(async (req, res) => {
//   const { tBot, vBot } = req
  
//   const { id } = req.body
  
//   const user = await User.findById(id)
//   const userAdmins = await User.find({ isAdmin: true })
//   console.log(user)
  
//   if (user) {
//      if (user.authMethod === 'Viber') {
//        vBot.sendMessage({id: user.userId },new TextMessage('Ваш заказ принят. '))
//   } else {
//     if (user.authMethod === 'Telegram') {
//       tBot.sendMessage(
//         user.userId,
//         `Ваш заказ принят`
//       )
//     }
//   }
//   }

//   userAdmins.forEach(admin => {
//     tBot.sendMessage(admin.userId,'У вас новый заказ')
//   })
 
//   res.status(200).json({message:'Ok'})
// })


