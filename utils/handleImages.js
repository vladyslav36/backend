const fs = require("fs-extra")
const path = require("path")

// Функция перемещает картинку из папки /upload/images в папку
// /upload/images/category
exports.moveToDir = (uploadedImage, slug, image,folder) => {
  
  const ROOT_NAME = process.env.ROOT_NAME
  const extName = path.extname(uploadedImage)
  const newPath = `/upload/images/${folder}/${slug}${extName}`
  const fullNewPath = `${ROOT_NAME}${newPath}`
  const oldPath = `${ROOT_NAME}${uploadedImage}`
  const pathToRemove = image ? `${ROOT_NAME}${image}` : ""

  // перемещение файла в папку <folder>
  const save = () => {
    if (fs.existsSync(`${oldPath}`)) {
      fs.rename(oldPath, fullNewPath, (err) => {
        if (err) throw err
      })
    } else {
      console.log("File not exist")
    }
  }
  // Удаление старой картинки
  if (fs.existsSync(`${pathToRemove}`)) {
    fs.rm(pathToRemove, (err) => {
      if (err) throw err
    })
  } else {
    console.log("File not exist")
  }

  // Если папка уже есть-сохранение картинки, если нет создание папки и сохранение картинки
  if (fs.existsSync(path.dirname(fullNewPath))) {
    save()
  } else {
    fs.mkdir(path.dirname(fullNewPath), (err) => {
      if (err) throw err
      save()
    })
  }
// Очистка папки Temp
  const clearTemp = async () => {
    try {
      await fs.emptyDir(`${ROOT_NAME}/upload/images/temp`)
    } catch (error) {
      console.error(error)
    }
  }
  clearTemp()
  
  return newPath
}
// Функция переименовывает картинку со старым слагом в соответствии с новым slug
// если пользователь редактировал категорию без изменения картинки
exports.updateImageToSlug = (slug, image) => {
  const ROOT_NAME = process.env.ROOT_NAME
  if (image) {
    const dirName = path.dirname(image)
  const extName=path.extname(image)
  const newImage = `${dirName}/${slug}${extName}`
  if (fs.existsSync(`${ROOT_NAME}${image}`)) {
    fs.rename(`${ROOT_NAME}${image}`, `${ROOT_NAME}${newImage}`, (err) => {
      if (err) throw err      
    })
  }
return newImage
  } else {
    return ''
  }
  
}
// Удаление картинки при удалении категории
exports.removeImage = (image) => {
  const ROOT_NAME = process.env.ROOT_NAME
  const pathToRemove=image?`${ROOT_NAME}${image}`:''
  if (fs.existsSync(`${pathToRemove}`)) {
    fs.rm(pathToRemove, (err) => {
      if (err) throw err
    })
  } else {
    console.log("File not exist")
  }
}