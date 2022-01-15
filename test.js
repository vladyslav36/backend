// const myPromise = new Promise((res, rej) => {
//   setTimeout(()=>res('1000s'),1000)
// })

// // myPromise.then((msg)=>console.log(msg))
// const getPromise = async () => {
//   const data = await myPromise
//   console.log(data)
// }

// getPromise()

// let arr = [
//   { name: "red", price: 34 },
//   { name: "green", price: 78 },
//   { name: "blue", price: 123 },
//   { name: "orange", price: 123 },
// ]

// console.log(arr.sort((a,b)=>a.name>b.name?1:-1))

// const nodemailer=require('nodemailer')

// const mail = async ()=>{
//   const transporter = nodemailer.createTransport({
//     host: "smtp.ukr.net",
//     port: 465,
//     secure: true,
//     auth: {
//       user: "test_karmen@ukr.net",
//       pass: "nMlBZ7ff7y1nSjS4",
//     },
//   })
//   const info = await transporter.sendMail({
//     from: "test_karmen@ukr.net",
//     to: 'vladyslav36@gmail.com',
//     subject: 'Hello',
//     text: 'Привет с сайта Кармен',
//     // html:'<h1>Hello</h1>'
//   })

//   console.log('Message sent',info.messageId)
// }

// mail().catch(console.error)

// const Downloader = require("nodejs-file-downloader")
// const urlExist = require('url-exists-async-await')
// urlExist(
//   "http://localhost:5000/upload/images/product/trek-18b711ba.jpg",
//   function (err, exists) {
//     console.log(exists) // true
//   }
// )

//  const func=async () => {
//   try {
//     console.log(await urlExistPromise(
//     "http://localhost:5000/upload/images/product/trek-18b711ba.jpg"
//   ))
//   } catch (error) {
//     console.log(error)
//   }
  
// }

// func()
// const func = async () => {
//   const url = "http://localhost:5000/upload/images/product/trek-18b711b.jpg"
  
//   try {
//   if (await urlExist(url)) {
//     const downloader = new Downloader({
//       url,
//       directory: "./downloads",
//     })
//       downloader.download()
//       console.log("ok")
//     }
//     } catch (error) {
//       console.log(error)
//     }
// }

// func()


