export const inviteUserToBoardSocket = (socket) => {
  // Lắng nghe sự kiện mà client emit lên có tên là FE_USER_INVITED_TO_BOARD
  socket.on('FE_USER_INVITED_TO_BOARD', (invitation) => {
    // Emit sự kiện ngược lại cho những client khác trừ client thực hiện request này --> để FE check
    socket.broadcast.emit('BE_USER_INVITED_TO_BOARD', invitation)
  })
}
