// App.jsx
import React from 'react'
import Landing from './components/landing'
import { Route, Routes } from 'react-router-dom'
import Blog from './components/BlogPage'
import Find from "./components/find";
import Chat from "./components/chat.jsx";
import Article from "./components/ArticlePage";
import Layout from './components/Layout';
// import VantaBackground from './components/VantaBackground';

const App = () => {
  return (
    <div className="relative">
      {/* <VantaBackground /> */}
      <Routes>
        <Route path='/' element={
          <Layout>
            <Landing />
          </Layout>
        } />
        <Route path='/chat' element={
          <Layout showHealthTopics={true}>
            <Chat />
          </Layout>
        } />
        <Route path='/find' element={
          <Layout showHealthTopics={true}>
            <Find />
          </Layout>
        } />  
        <Route path='/blog' element={
          <Layout showHealthTopics={true}>
            <Blog />
          </Layout>
        } />
        <Route path='/blog/:pageid' element={
          <Layout>
            <Article />
          </Layout>
        } />
      </Routes>
    </div>
  )
}

export default App