const multer = require('multer')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log(file)
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    console.log(file)
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
  }
})

//const types = ['image/png', 'image/jpeg', 'image.jpg']

const fileFilter = (req, file, cb) => {
  // if (types.includes(file.mimetype)) {
  //   cb(null, true)
  // } else {
  //   cb(null, false)
  // }
  cb(null, true)
}

module.exports = multer({storage, fileFilter})
