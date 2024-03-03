import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPE } from '~/utils/constants'

const createNew = async (req, res, next) => {
  // Back-end bắt buộc phải validate dữ liệu
  // Tốt nhất là validate dữ liệu cả Font-end và Back-end
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).required()
  })

  try {
    // Chỉ định abortEarly: false để trường hợp có nhiều lỗi validation thì trả về nhiều lỗi cùng một lúc
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Validate dữ liệu hợp lệ --> Controller
    next()
  } catch (error) {
    // const errorMessage = new Error(error).message
    // const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

export const boardValidation = {
  createNew
}
