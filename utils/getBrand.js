const { idToString } = require("./idToString")

exports.getBrand = (category, categories) => {
  let result = category
  const findParent = (item) => {
    const parent = categories.find((elem) =>idToString(elem._id) ===idToString(item.parentCategoryId))
    if (parent) {
      result = parent
      findParent(parent)
    }
    return
  }
  if (category) {
    findParent(category)
  }
    
  
  

  return result
}
