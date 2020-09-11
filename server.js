const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

let clients = {}

io.on('connection', (socket) => {
  socket.on('auth', (data) => {
    clients[socket.id] = { name: data.userName }
    socket.join(data.roomName)
    console.log(clients[socket.id].name, 'connected')
  })

  socket.on('roomData', (data) => {
    const msg = {
      user: data.chatData.userName,
      message: data.message,
    }
    io.to(data.chatData.roomName).emit('roomMessage', msg)
    console.log(msg)
  })

  socket.on('disconnect', () => {
    console.log(clients[socket.id], 'disconnected')
    delete clients[socket.id]
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, (err) => {
  if (err) {
    throw Error(err)
  }
  console.log('Сервер запущен!')
})
