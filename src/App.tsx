import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { Routes,Route } from 'react-router'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import Chatroom from './pages/chatroom/Chatroom'
import Oto from './pages/oto/Oto'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/chatroom' element={<Chatroom/>}></Route>
        <Route path='/otochat/*' element={<Oto/>}>
        </Route>
        <Route path='*' element={<div>404</div>}>
        </Route>
      </Routes>
    </div>
  )
}

export default App
