const Order = require("../models/orderModel")
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const TextMessage = require("viber-bot").Message.Text
const FileMessage = require("viber-bot").Message.File
const FileUrl = require("viber-bot").Message.Url
const path = require("path")

const createXLS = require("../utils/createXLS")
const fs = require("fs-extra")

exports.addOrder = asyncHandler(async (req, res) => {
  const { userId, orderItems, delivery, totalQnt, totalAmount } = req.body
  const count = (await Order.estimatedDocumentCount()) + 1
  const order = await Order.create({
    userId,
    orderItems,
    delivery,
    totalQnt,
    totalAmount,
    count,
  })

  const user = await User.findById(userId)
  const pathXLSFile = await createXLS({ order, user })

  const { tBot, vBot } = req
  const userTAdmins = await User.find({ isAdmin: true, authMethod: "Telegram" })
  if (user) {
    if (user.authMethod === "Viber") {
      const stat = await fs.stat(pathXLSFile)
      const size = stat.size
      const fileName = path.basename(pathXLSFile)

      vBot.sendMessage(
        { id: user.userId },
        new TextMessage("Ваш заказ принят. ")
      )

      vBot.sendMessage(
        {
          id: user.userId,
        },
        new FileMessage(
          `${process.env.API_URL}/temp/${fileName}`,
          size,
          fileName
        )
      )
    } else {
      if (user.authMethod === "Telegram") {
        tBot.sendMessage(
          user.userId,
          `Ваш заказ № ${count} принят. Сумма к оплате  ${totalAmount}`
        )
        tBot.sendDocument(user.userId, pathXLSFile)
      }
    }
  }
  // send order to all admins
  userTAdmins.forEach((admin) => {
    tBot.sendMessage(admin.userId, "У вас новый заказ. ")
    tBot.sendDocument(admin.userId, pathXLSFile)
  })
  // await fs.remove(pathXLSFile)
  res.status(200).json({ order })
})

exports.getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const order = await Order.findById(id)
  res.status(200).json({ order })
})
exports.getOrderByUserId = asyncHandler(async (req, res) => {
  const { id } = req.params

  const orders = await Order.find({ userId: id })

  res.status(200).json({ orders })
})

exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
  res.status(200).json({ orders })
})

exports.deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params
  await Order.deleteOne({ _id: id })
  res.status(200).json({ message: "ok" })
})
