import React, { useState } from 'react'
import './AuthPage.scss'
import socket from '../../socket'

const AuthPage = ({ onLogged, chatData }) => {
  const [roomName, setRoomName] = useState('')
  const [userName, setUserName] = useState('')

  const logIn = () => {
    if (!roomName.trim() || !userName.trim()) {
      alert('Не все поля заполнены!')
    } else {
      socket.emit('auth', { roomName, userName })

      chatData({ roomName, userName })
      onLogged()
    }
  }

  return (
    <form className="form">
      <input
        className="form__input"
        type="text"
        placeholder="Название комнаты"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        autoFocus
      />
      <input
        className="form__input"
        type="text"
        placeholder="Ваше имя"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        onKeyPress={(e) => (e.key === 'Enter' ? logIn() : null)}
      />
      <button className="form__enter" type="button" onClick={logIn}>
        Войти
      </button>
    </form>
  )
}

export default AuthPage
