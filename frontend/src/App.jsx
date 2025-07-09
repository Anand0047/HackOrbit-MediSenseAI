// App.jsx
import React from 'react'
import Landing from './components/landing'
import { Route, Routes } from 'react-router-dom'
import Blog from './components/BlogPage'
import Find from "./components/find";
import Chat from "./components/chat.jsx";
import Article from "./components/ArticlePage";
import Layout from './components/Layout';
import ProtectedRoute from './Auth/ProtectedRoute';
import Login from './Auth/login/Login';
import Register from './Auth/register/Register';
import ForgotPassword from './Auth/ForgotPassword';
import ResetPassword from './Auth/ResetPassword';
import VerifyResetOtp from './Auth/VerifyResetOtp';
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
          <ProtectedRoute>
            <Layout showHealthTopics={true}>
              <Chat />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path='/find' element={
          <ProtectedRoute>
            <Layout showHealthTopics={true}>
              <Find />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path='/blog' element={
          <ProtectedRoute>
            <Layout showHealthTopics={true}>
              <Blog />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path='/blog/:pageid' element={
          <ProtectedRoute>
            <Layout>
              <Article />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Authentication */}

        <Route path='/login' element={<Login />} />

        <Route path='/register' element={<Register />} />

        <Route path='/forgot-password' element={<ForgotPassword />} />

        <Route path='/reset-password' element={
          <ProtectedRoute>
            <ResetPassword />
          </ProtectedRoute>
        } />

        <Route path='/verify-reset-otp' element={
          <ProtectedRoute>
            <VerifyResetOtp />
          </ProtectedRoute>
        } />

      </Routes>
    </div>
  )
}

export default App