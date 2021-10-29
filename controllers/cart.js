const nodemailer = require("nodemailer")
const asyncHandler=require('express-async-handler')



exports.sendMail =asyncHandler((req, res) => {
  const { mailString } = req.body 
    const user = process.env.MAILUSER
    const pass=process.env.MAILPASS
    const mail = async () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
  })
      const info = await transporter.sendMail({
        from: user,
        to: "vladyslav36@gmail.com",
        subject: "Заказ",        
        html: mailString,
      })

  
    }
    mail()
    res.status(200).json({message:'Письмо успешно отправлено'})
  
}
)


