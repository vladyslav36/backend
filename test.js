const input = {
  Размер: {
    2: {},
    3: {},
    4: {},
    5: {},
  },
  Цвет: {
    синий: {},
    красный: {},
    желтый: {},
    зеленый: {},
  },
  Объем: {
    96: {},
    102: {},
    108: {},
    112: {}
  },
 
}

// const orderArr = Object.keys(input)
// let output = {}

// for (let i = 1; i <= orderArr.length; i++){
//   output = {
//     ...Object.keys(input[orderArr[orderArr.length - i]])
//       .map((value) => ({ [value]: i === 1 ? "" : output }))
//       .reduce((acc, item) => ({ ...acc, ...item }), {}),
//   }
// }

const optionsToBarcods = (input = {}) => {
  const orderArr = Object.keys(input)
  let output = {}
  if (orderArr.length) {
    for (let i = 1; i <= orderArr.length; i++) {
      output = {
        ...Object.keys(input[orderArr[orderArr.length - i]])
          .map((value) => ({ [value]: i === 1 ? "" : output }))
          .reduce((acc, item) => ({ ...acc, ...item }), {}),
      }
    }
  }

  return output
}
const output = optionsToBarcods({})
  console.log(output)

