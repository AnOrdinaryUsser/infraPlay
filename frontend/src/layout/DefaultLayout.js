import React, { useState, useEffect } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import AppSidebarAdmin from '../components/AppSidebarAdmin';

const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;

/**
 * @component Default Layout
 * @description Is a default layout for the views.
 */
const DefaultLayout = () => {

  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [role, setRole] = useState([]);
  const [visibility, setVisibility] = useState(true)
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false)

  useEffect(() => {
    refreshToken();
}, []);


  const refreshToken = async () => {
    try {
        const response = await axios.get(`http://${IP_SERVER}:${PORT_BACKEND}/token`);
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setId(decoded.id);
        setRole(decoded.role);
        setEmail(decoded.email);
        setExpire(decoded.exp);
    } catch (error) {
        if (error.response) {
        }
    }
}

const axiosJWT = axios.create();

axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get(`http://${IP_SERVER}:${PORT_BACKEND}/token`);
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setName(decoded.name);
        setExpire(decoded.exp);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

  

  return (
    <div>
      {role == "Admin" ? (<AppSidebarAdmin />) : ( <AppSidebar />)}
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout
