import React, { useState, useEffect, useRef } from 'react'
import './ChatRoom.scss'
import socket from '../../socket'

const ChatRoom = ({ chatData }) => {
  const [message, setMessage] = useState('')
  const [dataFromServer, setDataFromServer] = useState([])
  const [roomUsers, setRoomUsers] = useState([])

  const messagesEndRef = useRef(null)

  let time = '00:00'

  useEffect(() => {
    socket.on('roomMessage', (msg) => {
      setDataFromServer([...dataFromServer, msg])
    })
    return () => socket.off('roomMessage')
  }, [dataFromServer])

  //скролл страницы вниз при новом сообщении
  useEffect(() => {
    messagesEndRef.current.scrollTo(0, 99999)
  }, [dataFromServer])

  useEffect(() => {
    socket.on('users', (users) => {
      setRoomUsers(users)
    })
    return () => socket.off('users')
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
    if (message.trim()) {
      getTime()
      const roomData = { chatData, message, time }
      setMessage('')
      socket.emit('roomData', roomData)
    }
  }

  return (
    <div className="chat">
      <div className="chat__wrapper">
        <h1 className="chat__title">{chatData.roomName}</h1>
        <ul className="chat__list">
          {typeof roomUsers === 'string' ? (
            <li className="chat__item">{roomUsers}</li>
          ) : (
            roomUsers.map((user, id) => {
              return (
                <li className="chat__item" key={id}>
                  {user}
                </li>
              )
            })
          )}
        </ul>
      </div>

      <div className="chat__message">
        <ul className="chat__message-list" ref={messagesEndRef}>
          {dataFromServer.length ? (
            dataFromServer.map((data, id) => {
              return (
                <li key={id} className="chat__message-item">
                  <p className="chat__message-info">
                    <span>{data.user}</span> <span>{data.time}</span>
                  </p>
                  <p className="chat__message-msg">{data.message}</p>
                </li>
              )
            })
          ) : (
            <li className="chat__message-first">Начните диалог</li>
          )}
        </ul>
        <div className="chat__message-actions">
          <input
            className="chat__message-input"
            type="text"
            placeholder="Введите сообщение..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => (e.key === 'Enter' ? sendMsg() : null)}
            autoFocus
          />
          <button className="chat__message-enter" type="button" onClick={sendMsg}>
            Отправить
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatRoom
