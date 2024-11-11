import express from 'express'
import { boardController } from '~/controllers/boardController'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

// /v1/boards
Router.route('/')
  .get(boardController.getBoards)
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update) // update

Router.route('/supports/moving-card').put(
  boardValidation.moveCardInDifferentColumn,
  boardController.moveCardInDifferentColumn
)
export const boardRoute = Router
