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
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const RegisterEmail = React.lazy(() => import('./views/pages/registerEmail/RegisterEmail.js'))
const TokenVerified = React.lazy(() => import('./views/pages/registerEmail/TokenVerified.js'))


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
            <Route exact path="/ResetPassword" name="ResetPassword" element={<ResetPassword/>}/>
            <Route exact path="/RegisterEmail" name="RegisterEmail" element={<RegisterEmail/>}/>
            <Route exact path="/TokenVerified" name="TokenVerified" element={<TokenVerified/>}/>
            <Route exact path="/embed/:gameId" element={<EmbedPage />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    )
  }
}

export default App
