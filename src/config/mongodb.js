import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

let trelloDatabaseInstance = null

// Khởi tạo một đối tượng mongoClientInstance để connect tới MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  // serverApi có từ MongoDB server 5.0.0 trở lên, có thể không dùng hoặc không
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// Kết nối tới Database
export const CONNECT_DB = async () => {
  // Gọi kết nối tới MongoDB Atlas với URI đã khai báo trong thân của mongoClientInstance
  await mongoClientInstance.connect()

  // Kết nối thành công thì lấy ra Database theo tên và gán ngược nó lại vào biến trelloDatabaseInstance
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

// Đóng kết nối Database khi cần
export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}

// Function GET_DB (không async) này có nhiệm vụ export trelloDatabaseInstance để có thể dùng ở nhiều nơi
export const GET_DB = () => {
  if (!trelloDatabaseInstance)
    throw new Error('Must connect to database first!!')
  return trelloDatabaseInstance
}
