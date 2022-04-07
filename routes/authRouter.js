const express = require("express");
const {body} = require("express-validator");
const db = require("../models");
const AuthController = require("../controllers/AuthController");
const checkValidationErrors = require("../middleware/handleValidationErrors");

const routerWrapper = (refreshTokenInBody) => {
  const router = express.Router();

  router.post(
    '/login',
    body('email').isEmail(),
    body('password').isLength({min: 3}),
    checkValidationErrors,
    AuthController.login(refreshTokenInBody)
  );

  router.post(
    '/register/leader',
    body('email').isEmail().custom(email => {
      return db.User.findOne({where: {email}}).then(user => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      });
    }),
    body('password').isLength({min: 3}),
    body('firstName').isLength({min: 1}).isAlpha().optional(),
    body('lastName').isLength({min: 1}).isAlpha().optional(),
    checkValidationErrors,
    AuthController.registerLeader
  );

  router.post(
    '/register/student',
    body('email').isEmail().custom(email => {
      return db.User.findOne({where: {email}}).then(user => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      });
    }),
    body('password').isLength({min: 3}),
    body('firstName').isLength({min: 1}).isAlpha().optional(),
    body('lastName').isLength({min: 1}).isAlpha().optional(),
    body('inviteCode').notEmpty(),
    checkValidationErrors,
    AuthController.registerStudent
  );

  return router
}

module.exports = routerWrapper
