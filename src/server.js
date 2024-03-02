import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'

const START_SERVER = () => {
  const app = express()

  app.get('/', async (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    //   eslint-disable-next-line no-console
    console.log(
      `3. Hello ${env.AUTHOR}! I am running at http://${env.APP_HOST}:${env.APP_PORT}/`
    )
  })

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
