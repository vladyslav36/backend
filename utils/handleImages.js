const fs = require("fs-extra")

// Удаление картинки 
exports.removeImage = async (image) => {
  try {
    const ROOT_NAME = process.env.ROOT_NAME
    if (image) {
      const pathToRemove = `${ROOT_NAME}${image}`
      await fs.remove(pathToRemove)
    }
  } catch (error) {
    console.error(err)
  }
}
