// https://www.npmjs.com/package/jsonwebtoken
import JWT from 'jsonwebtoken'

/**
 * JWT Token cần 3 tham số
 * userInfo: Thông tin đính kèm vào token
 * secretSignature: Chữ ký bí mật
 * tokenLife: Thời gian sống của token
 */
const generateToken = (userInfo, secretSignature, tokenLife) => {
  // eslint-disable-next-line no-empty
  try {
    // Thuật toán mặc định JWT là HS256
    return JWT.sign(userInfo, secretSignature, {
      algorithm: 'HS256',
      expiresIn: tokenLife
    })
  } catch (error) {
    throw new Error(error)
  }
}
const verifyToken = async (token, secretSignature) => {
  // eslint-disable-next-line no-empty
  try {
    return JWT.verify(token, secretSignature)
  } catch (error) {
    throw new Error(error)
  }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}
