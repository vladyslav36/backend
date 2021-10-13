const nodemailer = require("nodemailer")




exports.sendMail = (req, res) => {
  const { mailString } = req.body
  try {
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
        subject: "Hello",        
        html: mailString,
      })

  
    }
    mail()
    res.status(200).json({msg:'Письмо успешно отправлено'})
  } catch (error) {
    res.status(500).json({msg:'Error to send email'})
  }
}



