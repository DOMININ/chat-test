const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const rooms = new Map()

app.get('/rooms', (req, res) => {
  res.json(rooms)
})

io.on('connection', (socket) => {
  console.log('socket connected', socket.id)

  socket.on('message', (msg) => {
    io.emit('message', msg)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id)
  })
})

server.listen(9999, (err) => {
  if (err) {
    throw Error(err)
  }
  console.log('Сервер запущен!')
})
