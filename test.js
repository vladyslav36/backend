
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
  const checker = (existObj, newObj) =>
    Object.keys(newObj).forEach((item) => {
      if (!existObj.hasOwnProperty(item)) return
      if (typeof newObj[item] === "object") {
        checker(existObj[item], newObj[item])
      } else {
        newObj[item] = existObj[item]
      }
    })

  checker(existBc, newBc)
  return newBc
}

// console.log(copyBarcods(barcods,newBarcods))

const xlsToJson = require("convert-excel-to-json")

const file = `${__dirname}/upload/prices/priselightstep-ed8691e0.xlsx`
// const rez = xlsToJson({
//   sourceFile: file,
//   columnToKey: {
//     B: 'name',
//     E:'price'
//   },

// })
// console.log(rez)






// ф-я переноса прайсов из баркода в опции магазина
// сначала находим изменяющуюся опцию. Если изменяющихся опций несколько выводится ошибка.
// Результат - объект содержащий название опции и level уровень вложенности
// Затем создаем объект прайсов изменяющейся опции и общий прайс для остальных опций,
// которые не меняются как минимальный из объекта прайсов
// И в завершении создается новый объект опций по ключам старого объекта
const bcPricesToOptions = (barcods, options) => {

  // ф-я сравнения объектов по их содержимому
  const compareObj = (obj1, obj2) => {
    if (obj1 === obj2) {
      return true
    }

    if (typeof obj1 !== typeof obj2) {
      return false
    }

    if (
      typeof obj1 !== "object" ||
      typeof obj2 !== "object" ||
      obj1 === null ||
      obj2 === null
    ) {
      return obj1 === obj2
    }

    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) {
      return false
    }

    for (let prop of keys1) {
      if (!compareObj(obj1[prop], obj2[prop])) {
        return false
      }
    }
    return true
  }

  // ф-я находит изменяющуюся опцию
  const searchOption = (barcods, options) => {
    const option = []
    const levels = []
    let level = 0
    const searchLevel = (bc) => {
      const firstKey = Object.keys(bc)[0]
      const isEqual = Object.keys(bc).every((item) =>
        compareObj(bc[firstKey], bc[item])
      )
      if (!isEqual) {
        const changedOption = Object.keys(options)[level]
        if (!option.includes(changedOption)) option.push(changedOption)
        if (!levels.includes(level)) levels.push(level)
      }
      if (typeof bc[firstKey] === "string") {
        return
      }
      level++
      for (let key in bc) {
        searchLevel(bc[key])
      }
      level--
    }
    searchLevel(barcods)
    return { option, levels }
  }

  // создание объекта прайсов для изменяющегося объекта опции по первому элементу
  // т.к.предполагается что остальные опции не меняются
  const searchPrices = (bc) => {
    return Object.keys(bc)
      .map((item) => {
        if (typeof bc[item] === "string") {
          return { [item]: bc[item] }
        } else {
          const getDeepPrice = (bcObj) => {
            const firstKey = Object.keys(bcObj)[0]
            if (typeof bcObj[firstKey] === "string") {
              return bcObj[firstKey]
            } else {
              return getDeepPrice(bcObj[firstKey])
            }
          }
          const price = getDeepPrice(bc[item])
          return { [item]: price }
        }
      })
      .reduce((acc, value) => ({ ...acc, ...value }), {})
  }

  // ф-я формирует объект прайсов если известен уровень погружения измененного прайса
  const getPricesByLevel = (barcods, targetLevel) => {
    let level = 0

    const deepToBc = (bc) => {
      if (level === targetLevel) {
        return searchPrices(bc)
      } else {
        const firstKey = Object.keys(bc)[0]
        level++
        return deepToBc(bc[firstKey])
      }
    }

    return deepToBc(barcods)
  }

  const changedOption = searchOption(barcods, options)
  if (changedOption.option.length > 1) {
    
    return { newOptions: {} ,error:true}
  }

  let totalPrice = ""
  let pricesObj = {}
  // если измененных опций нет
  if (changedOption.option.length === 0) {
    totalPrice = Object.values(searchPrices(barcods))[0]
  } else {
    pricesObj = getPricesByLevel(barcods, changedOption.levels[0])
    totalPrice = Object.values(pricesObj).sort((a, b) => a - b)[0]
  }

  const newOptions = Object.assign(
    {},
    ...Object.keys(options).map((option) => ({
      [option]: Object.assign(
        {},
        ...Object.keys(options[option]).map((value) => {
          if (
            changedOption.option.length != 0 &&
            option === changedOption.option[0]
          ) {
            return totalPrice === pricesObj[value]
              ? { [value]: { price: pricesObj[value], isChanged: false } }
              : { [value]: { price: pricesObj[value], isChanged: true } }
          } else {
            return { [value]: { price: totalPrice, isChanged: false } }
          }
        })
      ),
    }))
  )
  return {newOptions,error:false}
  
}



