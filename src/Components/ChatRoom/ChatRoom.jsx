import React, { useState, useEffect } from 'react'
import socket from '../../socket'

const ChatRoom = ({ chatData }) => {
  const [message, setMessage] = useState('')
  const [dataFromServer, setDataFromServer] = useState([])

  useEffect(() => {
    socket.on('roomMessage', (msg) => {
      setDataFromServer([...dataFromServer, msg])
    })
  }, [dataFromServer])

  const sendMsg = () => {
    console.log(chatData)
    const roomData = { chatData, message }
    setMessage('')
    socket.emit('roomData', roomData)
  }

  return (
    <div>
      <h1>Комната: {chatData.roomName}</h1>
      <ul>
        {dataFromServer.map((data, id) => {
          return (
            <li key={id}>
              {data.user}: {data.message}
            </li>
          )
        })}
      </ul>
      <input
        type="text"
        placeholder="Сообщение"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => (e.key === 'Enter' ? sendMsg() : null)}
      />
      <button type="button" onClick={sendMsg}>
        Отправить
      </button>
    </div>
  )
}

export default ChatRoom
