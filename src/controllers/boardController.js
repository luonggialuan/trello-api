import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  try {
    // Điều hướng dữ liệu sang tầng Services

    // Có kết quả thì trả về phía Client
    res
      .status(StatusCodes.CREATED)
      .json({ message: 'POST from Controller: API create new board' })
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew
}
