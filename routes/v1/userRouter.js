const express = require("express");
const {body, param} = require("express-validator");
const db = require("../../models")
const isAuthenticated = require("../../middleware/isAuthenticated");
const handleValidationErrors = require("../../middleware/handleValidationErrors");
const UserController = require("../../controllers/UserController");

const router = express.Router();

router.get(
  '/:userId',
  param('userId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  (req, res, next) => req.user.id === parseInt(req.params['userId']) ? next() : res.sendStatus(403),
  UserController.getOne
);

router.patch('/:userId',
  param('userId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  body('email').isEmail().custom((email, {req}) => {
    return db.User.findOne({where: {email}}).then(user => {
      if (user && user.id !== req.user.id) {
        return Promise.reject('E-mail already in use');
      }
    });
  }).optional(),
  body('password').isLength({min: 3}).optional(),
  body('firstName').isLength({min: 1}).isAlpha().optional(),
  body('lastName').isLength({min: 1}).isAlpha().optional(),
  handleValidationErrors,
  UserController.update
);

module.exports = router
