import React, { useState } from 'react'
import AuthPage from './Components/AuthPage/AuthPage'
import ChatRoom from './Components/ChatRoom/ChatRoom'

const App = () => {
  const [isAuth, setIsAuth] = useState(false)
  const [chatData, setChatData] = useState({})

  return (
    <div>
      {isAuth ? (
        <ChatRoom chatData={chatData} />
      ) : (
        <AuthPage
          chatData={(data) => {
            setChatData(data)
          }}
          onLogged={() => setIsAuth(true)}
        />
      )}
    </div>
  )
}

export default App
