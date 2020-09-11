const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

let clients = {}

io.on('connection', (socket) => {
  socket.on('auth', (data) => {
    clients[socket.id] = { name: data.userName }
    socket.join(data.roomName)
    console.log(clients[socket.id].name, 'connected')
  })

  socket.on('roomData', (data) => {
    io.to(data.chatData.roomName).emit('roomMessage', data.message)
  })

  socket.on('disconnect', () => {
    console.log(clients[socket.id].name, 'disconnected')
  })
})

server.listen(9999, (err) => {
  if (err) {
    throw Error(err)
  }
  console.log('Сервер запущен!')
})
