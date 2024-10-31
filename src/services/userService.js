import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatter'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Kiểm tra email đã tồn tại trong hệ thống hay chưa
    const existedUser = await userModel.findOneByEmail(reqBody.email)
    if (existedUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already existed!')
    }

    // Tạo data lưu vào db
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    // Gửi email xác thực tài khoản
    // return dữ liệu
    return pickUser(getNewUser)
  } catch (error) {
    throw error
  }
}

export const userService = { createNew }
