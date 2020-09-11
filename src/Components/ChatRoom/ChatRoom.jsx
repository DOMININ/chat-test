import React, { useState } from 'react'
import socket from '../../socket'

const ChatRoom = ({ chatData }) => {
  const [message, setMessage] = useState('')

  const sendMsg = () => {
    const roomData = { chatData, message }
    socket.emit('roomData', roomData)
  }

  socket.on('roomMessage', (msg) => {
    console.log(msg)
  })

  return (
    <div>
      <input
        type="text"
        placeholder="Сообщение"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="button" onClick={sendMsg}>
        Отправить
      </button>
    </div>
  )
}

export default ChatRoom
