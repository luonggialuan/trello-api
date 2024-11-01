import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import ApiError from '~/utils/ApiError'
import { env } from '~/config/environment'

// Middleware: xác thực JWT accessToken nhận được từ phía FE có hợp lệ không
const isAuthorized = async (req, res, next) => {
  // Lấy accessToken nằm trong request cookie header phía client - withCredential ở authorizeAxiosInstance
  const clientAccessToken = req.cookies?.accessToken

  if (!clientAccessToken) {
    next(
      new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found)')
    )
    return
  }

  try {
    // Bước 1: Xác thực accessToken
    const accessTokenDecoded = await JwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )

    // Bước 2:
    req.jwtDecoded = accessTokenDecoded

    // Bước 3:
    next()
  } catch (error) {
    // Case 1: accessToken hết hạn
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token'))
      return
    }

    // Case 2: accessToken không hợp lệ
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }
}

export const authMiddleware = { isAuthorized }
