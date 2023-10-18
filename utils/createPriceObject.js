exports.createPriceObject = ({ ownOptions, optionValues }) => {
 
  // убираем поля пустышки
  const fillingOwnOptions = Object.assign(
    {},
    ...Object.keys(ownOptions)
      .filter((item) => ownOptions[item].length)
      .map((item) => ({ [item]: ownOptions[item].sort() }))
  )

  let rez = { price: "", barcode: "" }

  Object.keys(fillingOwnOptions)
    .reverse()
    .forEach((option) => {
      rez = Object.assign(
        {},
        ...fillingOwnOptions[option].map((value) => ({
          [value]: JSON.parse(JSON.stringify(rez)),
        }))
      )
    })

  //  копируем значения полей из староно объекта values.options во вновь созданный rez
  const deep = (newOptions, oldOptions) => {
    if (newOptions.hasOwnProperty("price")) return newOptions
    Object.keys(newOptions).forEach((item) => {
      if (!oldOptions.hasOwnProperty(item)) return
      if (newOptions[item].hasOwnProperty("price")) {
        newOptions[item] = JSON.parse(JSON.stringify(oldOptions[item]))
      } else {
        deep(newOptions[item], oldOptions[item])
      }
    })
    return newOptions
  }

  return deep(rez, optionValues)
  
}