import { env } from '~/config/environment'
const brevo = require('@getbrevo/brevo')

let apiInstance = new brevo.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, customHtmlContent) => {
  let sendSmtpEmail = new brevo.SendSmtpEmail()

  // Tài khoản gửi email: --> ADMIN_EMAIL_ADDRESS
  sendSmtpEmail.sender = {
    email: env.ADMIN_EMAIL_ADDRESS,
    name: env.ADMIN_EMAIL_NAME
  }

  // Gửi email tới những tài khoản
  sendSmtpEmail.to = [{ email: recipientEmail }]

  // Tiêu đề email
  sendSmtpEmail.subject = customSubject

  // Nội dung email dạng HTML
  sendSmtpEmail.htmlContent = customHtmlContent

  // sendTransacEmail trả về Promise
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = {
  sendEmail
}
