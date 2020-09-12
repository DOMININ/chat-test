const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const PORT = 5000

let clients = {}
let roster = {}

io.on('connection', (socket) => {
  socket.on('auth', (data) => {
    clients[socket.id] = { name: data.userName }
    socket.join(data.roomName)

    roster[data.roomName] = roster[data.roomName]
      ? [roster[data.roomName], clients[socket.id].name]
      : [clients[socket.id].name]

    io.to(data.roomName).emit('users', roster[data.roomName])
    console.log(`${clients[socket.id].name} присоединился к комнате ${data.roomName}`)
  })

  socket.on('roomData', (data) => {
    const msg = {
      user: data.chatData.userName,
      message: data.message,
      time: data.time,
    }
    io.to(data.chatData.roomName).emit('roomMessage', msg)
  })

  socket.on('disconnecting', () => {
    const rooms = Object.keys(socket.rooms)

    // если есть комната, то удалить юзера из комнаты/удалить комнату
    if (roster[rooms[1]]) {
      let index = roster[rooms[1]].indexOf(clients[socket.id].name)
      roster[rooms[1]].splice(index, 1)

      if (!roster[rooms[1]].length) {
        delete roster[rooms[1]]
      }

      io.to(rooms[1]).emit('users', roster[rooms[1]])
      console.log('Готовые данные', roster)
    }
  })

  socket.on('disconnect', () => {
    console.log(clients[socket.id], 'disconnected')
    delete clients[socket.id]
  })
})

server.listen(PORT, (err) => {
  if (err) {
    throw Error(err)
  }
  console.log('Сервер запущен!')
})
