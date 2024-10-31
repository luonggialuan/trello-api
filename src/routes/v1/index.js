import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'
import { columnRoute } from '~/routes/v1/columnRoute'
import { cardRoute } from '~/routes/v1/cardRoute'
import { userRoute } from './userRoute'

const Router = express.Router()

// Check APIs v1/status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use' })
})

// Boards API
Router.use('/boards', boardRoute)

// Columns API
Router.use('/columns', columnRoute)

// Cards API
Router.use('/cards', cardRoute)

// Users API
Router.use('/users', userRoute)

export const APIs_V1 = Router
