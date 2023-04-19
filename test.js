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
// const output = optionsToBarcods(input)
  
const barcods = {
  2: {
    синий: { 96: "a", 102: "", 108: "", 112: "" },
    красный: { 96: "", 102: "s", 108: "", 112: "" },
  },
  3: {
    синий: { 96: "", 102: "d", 108: "", 112: "f" },
    красный: { 96: "", 102: "g", 108: "", 112: "" },
  },
  4: {
    синий: { 96: "", 102: "", 108: "", 112: "h" },
    красный: { 96: "", 102: "j", 108: "", 112: "" },
  },
}

const newBarcods = {
  2: {
    синий: { 96: "", 102: "", 112: "" },
    красный: { 96: "", 102: "", 112: "" },
    желтый: { 96: "", 102: "", 112: "" },
  },
  3: {
    синий: { 96: "", 102: "", 112: "" },
    красный: { 96: "", 102: "", 112: "" },
    желтый: { 96: "", 102: "", 112: "" },
  },
  4: {
    синий: { 96: "", 102: "", 112: "" },
    красный: { 96: "", 102: "", 112: "" },
    желтый: { 96: "", 102: "", 112: "" },
  },
}

// const crumbsArr = [2, 'синий', 96]

// const lastObj = crumbsArr.slice(0, -1).reduce((acc, item) => acc[item], barcods)
// console.log(lastObj)
// const lastKey = crumbsArr[crumbsArr.length - 1]
// console.log(lastKey)
// lastObj[lastKey] = '100500'
// console.log(barcods)


const copyBarcods = (existBc, newBc) => {
  const checker = (existObj,newObj) => Object.keys(newObj).forEach(item => {
   
    if (!existObj.hasOwnProperty(item)) return
    if (typeof newObj[item] === "object") {
      checker(existObj[item],newObj[item])
    } else {
      newObj[item] = existObj[item]
    }
      
    
  })
  
  checker(existBc, newBc)
  return newBc
}

console.log(copyBarcods(barcods,newBarcods)) 

