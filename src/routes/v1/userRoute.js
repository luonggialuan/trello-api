import express from 'express'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.route('/register').post(
  userValidation.createNew,
  userController.createNew
)

Router.route('/verify').put(
  userValidation.verifyAccount,
  userController.verifyAccount
)

Router.route('/login').post(userValidation.login, userController.login)

Router.route('/logout').delete(userController.logout)

Router.route('/refresh-token').get(userController.refreshToken)

Router.route('/update').put(
  authMiddleware.isAuthorized,
  userValidation.update,
  userController.update
)

export const userRoute = Router
