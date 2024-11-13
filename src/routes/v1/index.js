import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'
import { columnRoute } from '~/routes/v1/columnRoute'
import { cardRoute } from '~/routes/v1/cardRoute'
import { userRoute } from './userRoute'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { invitationRoute } from '~/routes/v1/invitationRoute'

const Router = express.Router()

// Check APIs v1/status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use' })
})

// Boards API
Router.use('/boards', authMiddleware.isAuthorized, boardRoute)

// Columns API
Router.use('/columns', authMiddleware.isAuthorized, columnRoute)

// Cards API
Router.use('/cards', authMiddleware.isAuthorized, cardRoute)

// Users API
Router.use('/users', userRoute)

// Invitation API
Router.use('/invitations', authMiddleware.isAuthorized, invitationRoute)

export const APIs_V1 = Router
