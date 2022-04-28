const {body} = require("express-validator");
exports.nameRules = [
  body('firstName').isLength({min: 1}).custom((value) => {
    if (value.match(/^[a-zа-я]+$/i) === null) {
      return Promise.reject()
    }

    return Promise.resolve()
  }).optional(),
  body('lastName').isLength({min: 1}).custom((value) => {
    if (value.match(/^[a-zа-я]+$/i) === null) {
      return Promise.reject()
    }

    return Promise.resolve()
  }).optional(),
]
