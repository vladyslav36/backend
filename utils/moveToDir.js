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
      fs.rename(
        `${fullPath}`,
        `${dirName}/${slugFolder}/${baseName}`,
        (err) => {
          if (err) throw err
        }
      )
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
exports.moveToCategoryDir = (imagePath, imageName) => {
  const ROOT_NAME = process.env.ROOT_NAME
  const extName = path.extname(imagePath)  
  const newPath = `/upload/images/category/${imageName}${extName}`
  const fullNewPath = `${ROOT_NAME}${newPath}`
  const oldPath = `${ROOT_NAME}${imagePath}`
  
  const save = () => {
     if (fs.existsSync(`${oldPath}`)) {
    fs.rename(oldPath, fullNewPath, (err) => {
      if (err) throw err      
    })
  } else {
    console.log("File not exist")
  }
  }

  if (fs.existsSync(path.dirname(fullNewPath))) {
    save()
  }else{
    fs.mkdir(path.dirname(fullNewPath), (err) => {
      if (err) throw err      
      save()
    })
  }
 return newPath
}
