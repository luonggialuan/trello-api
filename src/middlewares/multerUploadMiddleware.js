import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import ApiError from '~/utils/ApiError'
import {
  ALLOW_COMMON_FILE_TYPES,
  LIMIT_COMMON_FILE_SIZE
} from '~/utils/validators'
// https://www.npmjs.com/package/multer

// Function kiểm tra loại file được chấp nhận
const customFileFilter = (req, file, callback) => {
  //   console.log('🐾 ~ file: multerUploadMiddleware.js:5 ~ file:', file)

  // Đối với multer, kiểm tra file type thông qua mimetype
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errMessage = 'File type is invalid. Only accept jpg, jpeg and png'
    return callback(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errMessage),
      null
    )
  }

  // Nếu như file hợp lệ
  return callback(null, true)
}

// Khởi tạo function upload được bọc bởi multer
const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customFileFilter
})

export const multerUploadMiddleware = { upload }
