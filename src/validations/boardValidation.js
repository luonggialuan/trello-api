import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  // Back-end bắt buộc phải validate dữ liệu
  // Tốt nhất là validate dữ liệu cả Font-end và Back-end
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict()
  })

  try {
    // Chỉ định abortEarly: false để trường hợp có nhiều lỗi validation thì trả về nhiều lỗi cùng một lúc
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Validate dữ liệu hợp lệ --> Controller
    next()
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    })
  }
}

export const boardValidation = {
  createNew
}
