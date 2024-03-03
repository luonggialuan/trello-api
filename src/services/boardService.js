import { slugify } from '~/utils/formatter'
import { boardModel } from '~/models/boardModel'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
    const createdBoard = await boardModel.createNew(newBoard)

    // Lấy bản ghi board sau khi gọi
    const getNewBoard = await boardModel.findOneById(
      createdBoard.insertedId.toString()
    )

    // Trả kết quả về, trong Service luôn phải có return
    return getNewBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew
}
