const getCurrencySymbol = require('./getCurrencySymbol')
const writeXlsxFile = require("write-excel-file/node")

const createXLS = async ({
  order: { orderItems, delivery, totalQnt, totalAmount, count },
  user,
}) => {
  const optionList = orderItems.length
    ? orderItems.reduce((acc, item) => {
        const itemOptions = Object.keys(item.options)
        itemOptions.forEach((option) => {
          if (!acc.includes(option)) acc.push(option)
        })
        return acc
      }, [])
    : []

  const spanMax = optionList.length + 3

  const HEADER = [
    [
      {
        value: `Заказ №${count}`,
        align: "center",
        span: spanMax,
        fontSize: 16,
        fontWeight: "bold",
      },
    ],
    [
      {
        value: `Клиент: ${
          user ? user.userName + " " + user.phone : "незврегмстрирован"
        }`,
        align: "center",
        span: spanMax,
        fontSize: 15,
      },
    ],
    [
      {
        value: "Доставка",
        span: spanMax,
        fontSize: 13,
        fontStyle: "italic",
      },
    ],
    [
      {
        value: `Имя ${delivery.name}`,
        span: 2,
        fontSize: 13,
        backgroundColor: "#FEF9E7",
      },
      null,

      {
        value: `Город ${delivery.city}`,
        span: spanMax - 2,
        fontSize: 13,
        backgroundColor: "#FEF9E7",
      },
    ],
    [
      {
        value: `Фамилия ${delivery.surname}`,
        span: 2,
        fontSize: 13,
        backgroundColor: "#FEF9E7",
      },
      null,
      {
        value: `Способ доставки ${
          delivery.pickup
            ? "самовывоз"
            : delivery.carrier + " № " + delivery.branch
        }`,
        fontSize: 13,
        span: spanMax - 2,
        backgroundColor: "#FEF9E7",
      },
    ],
    [
      {
        value: `Телефон ${delivery.phone}`,
        span: 2,
        fontSize: 13,
        backgroundColor: "#FEF9E7",
      },
      null,
      {
        value: `Способ оплаты ${
          delivery.prepaid ? "предоплата" : "наложенный платеж"
        }`,
        span: spanMax - 2,
        fontSize: 13,
        backgroundColor: "#FEF9E7",
      },
    ],
    [
      {
        value: "",
        span: spanMax,
      },
    ],
  ]

  const HEADER_ROW = [
    {
      value: "Модель",
      fontWeight: "bold",
      fontSize: 13,
      align: "center",
      width: "20",
    },
    ...optionList.map((item) => {
      return {
        value: item,
        fontWeight: "bold",
        fontSize: 13,
        width: "10",
        align: "center",
      }
    }),
    {
      value: "Цена",
      fontWeight: "bold",
      fontSize: 13,
      align: "center",
      width: "10",
    },
    {
      value: "Количество",
      fontWeight: "bold",
      fontSize: 13,
      align: "center",
      width: "10",
    },
  ]
  const columns = [
    {
      width: 40,
    },
    ...optionList.map((item) => {
      return {
        width: 15,
      }
    }),
    {
      width: 20,
    },
    {
      width: 15,
    },
  ]
  const ROWS = orderItems.map((item) => {
    const ROW = [
      {
        value: item.name,
        align: "left",
        fontSize: 13,
      },
      ...optionList.map((option) => {
        return {
          value: item.options[option] ? item.options[option] : "",
          align: "center",
          fontSize: 13,
        }
      }),
      {
        value: item.price + " " + getCurrencySymbol(item.currencyValue),
        align: "center",
        fontSize: 13,
      },
      {
        value: item.qnt,
        align: "center",
        fontSize: 13,
      },
    ]
    return ROW
  })
  const LAST_ROW = [
    {
      value: `Всего товаров ${totalQnt}`,
      fontSize: 13,
      fontStyle: "italic",
      backgroundColor: "#EAFAF1",
    },
    ...optionList.map((option) => {
      return { backgroundColor: "#EAFAF1" }
    }),
    {
      value: `Сумма заказа ${totalAmount}`,
      fontSize: 13,
      fontStyle: "italic",
      align: "right",
      span: 2,
      backgroundColor: "#EAFAF1",
    },
  ]
  const data = [...HEADER, HEADER_ROW, ...ROWS, LAST_ROW]
  const path = `${process.env.ROOT_NAME}/temp/file${count}.xlsx`
  await writeXlsxFile(data, {
    filePath: path,
    columns,
  })
  return path
}
module.exports=createXLS