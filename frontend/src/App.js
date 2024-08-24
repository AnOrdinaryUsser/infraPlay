import React, { Component, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const EnterEmail = React.lazy(() => import('./views/pages/forgotPassword/EnterEmail.js'))
const SentEmail = React.lazy(() => import('./views/pages/forgotPassword/SentEmail.js'))
const ResetPassword = React.lazy(() => import('./views/pages/forgotPassword/ResetPassword.js'))
const EmbedPage = React.lazy(() => import('./views/pages/h5p/h5p.js'))


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/EnterEmail" name="EnterEmail" element={<EnterEmail/>} />
            <Route exact path="/SentEmail" name="SentEmail" element={<SentEmail/>} />
            <Route exact path="/ResetPassword" name="ResetPassword" element={<ResetPassword/>} />
            <Route exact path="/embed/:gameId" element={<EmbedPage />} />
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    )
  }
}

export default App
