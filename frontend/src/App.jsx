import React from 'react'
import Landing from './components/landing'
import { Route, Routes } from 'react-router-dom'
import Blog from './components/BlogPage'
import Find from "./components/find";
import Chat from "./components/chat.jsx";

const App = () => {
  return (
    <>
  <Routes>
    <Route path='/' element={<Landing/>} / >
    <Route path='/chat' element={<Chat/>} / >
    <Route path='/find' element={<Find/>} / >  
    <Route path='/blog' element={<Blog/>} / >


  </Routes>
    </>
  )
}

export default App