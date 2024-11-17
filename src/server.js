import express from 'express'
import cors from 'cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import { corsOptions } from './config/cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import socketIo from 'socket.io'
import { inviteUserToBoardSocket } from './sockets/inviteUserToBoardSocket'

const START_SERVER = () => {
  const app = express()

  // Fix cache from disk của ExpressJS
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  // Cấu hình Cookie Parser
  app.use(cookieParser())

  // Xử lý CORS
  app.use(cors(corsOptions))

  // Enable req.body json data
  app.use(express.json())

  // Use APIs V1
  app.use('/v1', APIs_V1)

  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  // Tạo server mới bọc app của express để tạo real-time với socket.io
  const server = http.createServer(app)
  // Khởi tạo biến io với server và cors
  const io = socketIo(server, { cors: corsOptions })
  io.on('connection', (socket) => {
    inviteUserToBoardSocket(socket)
    // Thêm các socket khác ở đây...
  })

  if (env.BUILD_MODE === 'production') {
    server.listen(process.env.PORT || 4000, () => {
      //   eslint-disable-next-line no-console
      console.log(
        `3. Hello ${env.AUTHOR}! I am running at Port: ${process.env.PORT}/`
      )
    })
  } else {
    server.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      //   eslint-disable-next-line no-console
      console.log(
        `3. Hello ${env.AUTHOR}! I am running at http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`
      )
    })
  }
  // Thực hiện các tác vụ cleanup trước khi dừng server
  // https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
  exitHook(() => {
    console.log('1. Server is shutting down...')
    CLOSE_DB()
    console.log('2. Disconnected from MongoDB Cloud Atlas')
  })
}
// Chỉ khi khi kết nối tới Database thành công thì mới Start Server Back-end lên.
// Immediately-invoked / Anonymous Async Functions (IIFE)
;(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas')

    // Khởi động Server Back-end sau khi kết nối thành công database
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// Chỉ khi khi kết nối tới Database thành công thì mới Start Server Back-end lên.
// console.log('1. Connecting to MongoDB Cloud Atlas...')
// CONNECT_DB()
//   .then(() => console.log('2. Connected to MongoDB Cloud Atlas'))
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.error(error)
//     process.exit(0)
//   })
