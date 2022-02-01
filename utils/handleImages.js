const fs = require("fs-extra")
const path = require("path")
const sharp = require("sharp")

// Функция перемещает картинку из папки /upload/images в папку
// /upload/images/category
// exports.moveToDir = async (slug, image, folder) => {
//   try {
//     const ROOT_NAME = process.env.ROOT_NAME
//     if (image) {
//       const extName = path.extname(image)
//       const newPath = `/upload/images/${folder}/${slug}${extName}`
//       const fullNewPath = `${ROOT_NAME}${newPath}`
//       const oldPath = `${ROOT_NAME}${image}`

//       await fs.move(oldPath, fullNewPath)
//       return newPath
//     } else {
//       return ""
//     }
//   } catch (err) {
//     console.error(err)
//   }
// }
exports.resizeImage = (input) => {
  
    const ROOT_NAME = process.env.ROOT_NAME
    const parsed = path.parse(input)
    const sm = `${parsed.dir}/${parsed.name}-sm${parsed.ext}`
    const md = `${parsed.dir}/${parsed.name}-md${parsed.ext}`
    const outputMd = `${ROOT_NAME}${md}`
    const outputSm = `${ROOT_NAME}${sm}`
    sharp(`${ROOT_NAME}${input}`).resize({ width: 200 }).toFile(outputMd).catch(err=>console.log('Resizing error'))
    sharp(`${ROOT_NAME}${input}`)
      .resize({ width: 50 })
      .toFile(outputSm)
      .catch((err) => console.log("Resizing error"))    
    return { md, sm }
 
}
// exports.clearTempDir = async () => {
//   const ROOT_NAME = process.env.ROOT_NAME

//   try {
//     await fs.emptyDir(`${ROOT_NAME}/upload/images/temp`)
//   } catch (error) {
//     console.error(error)
//   }
// }
// Функция переименовывает картинку со старым слагом в соответствии с новым slug
// если пользователь редактировал категорию без изменения картинки
exports.updateImageToSlug = async (slug, image) => {
  try {
   const ROOT_NAME = process.env.ROOT_NAME
    if (image) {
      const dirName = path.dirname(image)
      const extName = path.extname(image)
      const newImage = `${dirName}/${slug}${extName}`
      await fs.move(`${ROOT_NAME}${image}`, `${ROOT_NAME}${newImage}`)
      return newImage
    } else {
      return ""
    }
  } catch (error) {
    console.error(error)
  }
}



// Удаление картинки при удалении категории
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
