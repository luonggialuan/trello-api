import { env } from '~/config/environment'

// Những domain được phép truy cập tới tài nguyên của Server
export const WHITELIST_DOMAINS = [
  'https://trello-web-sable.vercel.app'
  // Không cần config locahost nữa vì đã config ở file cors.js luôn luôn cho phép môi trường dev
  // 'http://localhost:5173'
  // ... thêm domain cho phép truy cập tài nguyên
]

export const BOARD_TYPE = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

export const WEBSITE_DOMAIN =
  env.BUILD_MODE === 'production'
    ? env.WEBSITE_DOMAIN_PRODUCTION
    : env.WEBSITE_DOMAIN_DEVELOPMENT
