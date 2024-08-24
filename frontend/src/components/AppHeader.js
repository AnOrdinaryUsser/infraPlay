import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CHeaderToggler,
  CImage,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu, cilExitToApp } from '@coreui/icons'

import { useNavigate } from 'react-router-dom'

import axios from 'axios';

/**
 * @component AppHeader
 * @description Component app header.
 */
const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const navigate = useNavigate()

  const IP_SERVER = process.env.REACT_APP_IP_SERVER;
  const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;

  const Logout = async () => {
    try {
        await axios.delete(`http://${IP_SERVER}:${PORT_BACKEND}/logout`);
        navigate("/");
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        {/* <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CImage src={logo} height={48} alt="Logo" />
        </CHeaderBrand> */}
        <CHeaderNav className="d-none d-md-flex me-auto">
          {/* Aquí puedes agregar elementos adicionales si es necesario */}
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          {/* Puedes ajustar las clases y estilos según tus necesidades */}
          <CHeaderToggler onClick={Logout} className="text-danger" style={{ marginLeft: 'auto' }}>
            <CIcon icon={cilExitToApp} size="lg" />
          </CHeaderToggler>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader