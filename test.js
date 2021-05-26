const fs = require('fs')
const path = require('path')


fs.mkdir(path.join(__dirname, '/upload/nika'),  (err)=> {
  if (err) throw err
  console.log('Directory was created..')
  fs.rename(path.join(__dirname, '/upload/456.txt'),path.join(__dirname, '/upload/nika/456.txt'),(err)=>{
  if (err) throw err
    
     console.log('ok')
})

  
 
})