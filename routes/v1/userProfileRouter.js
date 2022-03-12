const express = require("express");
const {body} = require("express-validator");
const db = require("../../models")
const isAuthenticated = require("../../middleware/isAuthenticated");
const checkValidationErrors = require("../../middleware/checkValidationErrors");
const UserProfileController = require("../../controllers/UserProfileController");

const router = express.Router();

router.get('/', isAuthenticated, UserProfileController.getOne);

router.patch('/',
  isAuthenticated,
  body('email').isEmail().custom((email, {req}) => {
    return db.User.findOne({where: {email}}).then(user => {
      if (user && user.id !== req.user.id) {
        return Promise.reject('E-mail already in use');
      }
    });
  }),
  body('password').isLength({min: 3}),
  body('firstName').isLength({min: 1}).isAlpha().optional(),
  body('lastName').isLength({min: 1}).isAlpha().optional(),
  checkValidationErrors,
  UserProfileController.updateOne
);

module.exports = router
