import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatter'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

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

    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject =
      'Trello: Please verify your email before using our services!'
    const htmlContent = `
      <h3>Here is your verification link:</h3>
      <h3>${verificationLink}</h3>
      <h3>Sincerely,<br/> - Trello - Luong Gia Luan - </h3>`

    // Gọi Provider gửi email
    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)

    // Gửi email xác thực tài khoản
    // return dữ liệu
    return pickUser(getNewUser)
  } catch (error) {
    throw error
  }
}

const verifyAccount = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const existedUser = await userModel.findOneByEmail(reqBody.email)

    if (!existedUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Account not found!')
    }

    if (existedUser.isActive) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your account is already active!'
      )
    }

    if (reqBody.token !== existedUser.verifyToken) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid')
    }

    const updateData = {
      isActive: true,
      verifyToken: null
    }

    const updatedUser = await userModel.update(existedUser._id, updateData)

    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}

const login = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const existedUser = await userModel.findOneByEmail(reqBody.email)

    if (
      !existedUser ||
      !bcryptjs.compareSync(reqBody.password, existedUser.password)
    ) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your Email or Password is not correct!'
      )
    }

    if (!existedUser.isActive) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your account is not active!'
      )
    }

    // * Tạo JWT Token
    // Thông tin được đính kèm trong JWT Token
    const userInfo = {
      _id: existedUser._id,
      email: existedUser.email
    }

    // Tạo access and refresh token
    const accessToken = JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )
    const refreshToken = JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )

    // Trả thông tin user kèm 2 tokens
    return { accessToken, refreshToken, ...pickUser(existedUser) }
  } catch (error) {
    throw error
  }
}

const refreshToken = async (clientRefreshToken) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    const accessToken = JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    return { accessToken }
  } catch (error) {
    throw error
  }
}

const update = async (userId, reqBody, userAvatarFile) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const existedUser = await userModel.findOneById(userId)

    if (!existedUser)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

    if (!existedUser.isActive)
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your account is not active!'
      )

    let updatedUser = {}

    if (reqBody.current_password && reqBody.new_password) {
      if (!bcryptjs.compareSync(reqBody.current_password, existedUser.password))
        throw new ApiError(
          StatusCodes.NOT_ACCEPTABLE,
          'Your Current Password is not correct!'
        )

      updatedUser = await userModel.update(userId, {
        password: bcryptjs.hashSync(reqBody.new_password, 8)
      })
    } else if (userAvatarFile) {
      // Upload file lên Cloud Storage (Cloudinary)
      const uploadResult = await CloudinaryProvider.streamUpload(
        userAvatarFile.buffer,
        'users'
      )

      // Lưu lại url avatar bào DB
      updatedUser = await userModel.update(userId, {
        avatar: uploadResult.secure_url
      })
    } else {
      updatedUser = await userModel.update(userId, reqBody)
    }

    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  update
}
