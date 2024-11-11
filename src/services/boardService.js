import { slugify } from '~/utils/formatter'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '~/utils/constants'

const createNew = async (userId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
    const createdBoard = await boardModel.createNew(userId, newBoard)

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
const getDetails = async (userId, boardId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
    const board = await boardModel.getDetails(userId, boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    // B1: Deep Clone board ra một cái mới để xử lý, không ảnh hưởng gì tới board ban đầu
    // https://www.javascripttutorial.net/javascript-primitive-vs-reference-values/
    const resBoard = cloneDeep(board)

    // B2: Đưa card về đúng column của nó
    resBoard.columns.forEach((column) => {
      // MongoDB có support method .equals
      column.cards = resBoard.cards.filter((card) =>
        card.columnId.equals(column._id)
      )
      // Convert ObjectId về string = toString()
      // column.cards = resBoard.cards.filter(
      //   (card) => card.columnId.toString() === column._id.toString()
      // )
    })

    // B3: Xóa mảng cards khỏi mảng ban đầu
    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

const update = async (boardId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = { ...reqBody, updatedAt: Date.now() }

    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  } catch (error) {
    throw error
  }
}

const moveCardInDifferentColumn = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // * B1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })

    // * B2: Cập nhật mảng cardOrderIds của Column tiếp theo
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })

    // * B3: Cập nhật lại trường columnId mới của card đã kéo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })

    return { updateResult: 'Successfully!' }
  } catch (error) {
    throw error
  }
}

const getBoards = async (userId, page, itemsPerPage) => {
  // eslint-disable-next-line no-useless-catch
  try {
    if (!page || page <= 0) page = DEFAULT_PAGE
    if (!itemsPerPage || itemsPerPage <= 0)
      itemsPerPage = DEFAULT_ITEMS_PER_PAGE

    const results = await boardModel.getBoards(
      userId,
      parseInt(page, 10),
      parseInt(itemsPerPage, 10)
    )

    return results
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardInDifferentColumn,
  getBoards
}
