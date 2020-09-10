import React, { useState } from 'react'
import socket from '../socket'

const AuthPage = () => {
  const [message, setMessage] = useState('')

  const onChangeInput = (e) => {
    setMessage(e.target.value)
  }

  const logIn = () => {
    socket.emit('message', message)
  }

  socket.on('message', (msg) => {
    setMessage(msg)
    console.log(msg)
  })

  return (
    <form>
      <i>{message}</i>
      <input type="text" placeholder="сообщение" value={message} onChange={onChangeInput} />
      <button type="button" onClick={logIn}>
        Отправить
      </button>
    </form>
  )
}

export default AuthPage
