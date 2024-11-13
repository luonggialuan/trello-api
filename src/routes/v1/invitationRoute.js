import express from 'express'
import { invitationController } from '~/controllers/invitationController'
import { invitationValidation } from '~/validations/invitationValidation'

const Router = express.Router()

Router.route('/board').post(
  invitationValidation.createNewBoardInvitation,
  invitationController.createNewBoardInvitation
)

export const invitationRoute = Router
