// Функция берет старый путь и название категории, создает на основе
// имени категории новую папку, перемещает туда картинку и 
// возвращает новый путь для сохранения в базе данных

const fs = require("fs")
const slugify = require("slugify")
const path = require("path")

exports.moveToDir = (imagePath, folder) => {
  const ROOT_NAME = process.env.ROOT_NAME
  const slugFolder = slugify(folder)
  const fullPath = path.join(ROOT_NAME, imagePath)
  const baseName = path.basename(fullPath)
  const dirName = path.dirname(fullPath)
  const newPath = `${path.dirname(imagePath)}/${slugFolder}/${baseName}`

  const saveFile = () => {
    if (fs.existsSync(fullPath)) {
      fs.rename(`${fullPath}`, `${dirName}/${slugFolder}/${baseName}`, (err) => {
        if (err) throw err
      })
    } else {
      console.log("File not exist.Upload the file")
    }
  }

  if (fs.existsSync(`${dirName}/${slugFolder}`)) {
    saveFile()
  } else {
    fs.mkdir(`${dirName}/${slugFolder}`, (err) => {
      if (err) throw err
      saveFile()
    })
  }
  return newPath
}
