import React, { useState, useEffect } from 'react'
import './ChatRoom.scss'
import socket from '../../socket'

const ChatRoom = ({ chatData }) => {
  const [message, setMessage] = useState('')
  const [dataFromServer, setDataFromServer] = useState([])
  const [roomUsers, setRoomUsers] = useState([])

  let time = '00:00'

  useEffect(() => {
    socket.on('roomMessage', (msg) => {
      setDataFromServer([...dataFromServer, msg])
    })
  }, [dataFromServer])

  useEffect(() => {
    socket.on('users', (users) => {
      setRoomUsers(users)
    })
  }, [roomUsers])

  const getTime = () => {
    const data = new Date()
    let hour = data.getHours()
    let minutes = data.getMinutes()

    hour = hour < 10 ? `0${hour}` : hour
    minutes = minutes < 10 ? `0${minutes}` : minutes

    time = `${hour}:${minutes}`
  }

  const sendMsg = () => {
    getTime()
    const roomData = { chatData, message, time }
    setMessage('')
    socket.emit('roomData', roomData)
  }

  return (
    <div>
      <h1>Комната: {chatData.roomName}</h1>
      <div>
        <h2>Пользователи</h2>
        <ul>
          {typeof roomUsers === 'string' ? (
            <li>{roomUsers}</li>
          ) : (
            roomUsers.map((user, id) => {
              return <li key={id}>{user}</li>
            })
          )}
        </ul>
      </div>
      <ul>
        {dataFromServer.map((data, id) => {
          return (
            <li key={id}>
              {data.user} {data.time}: {data.message}
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
