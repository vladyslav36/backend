const path = require('path')
const multer=require('multer')

 
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'upload/images')
    },
    filename: function (req, file, cb) {
      cb(
        null,
        `${path.basename(file.originalname)}`
      )
    }
  })
  
exports.upload = [multer({ storage }).single('image'),
  (req, res) => { res.json({ path: `/${req.file.path.replace(/\\/g, "/")}` }) }]

  
  
   
  

    
  

  
   
  


exports.uploadProduct = (req, res) => {
  res.send(``)
}