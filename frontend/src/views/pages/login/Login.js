import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CLink,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import image from "./../../../assets/images/background.jpg";
import logo from './../../../assets/images/fgusal.gif';  // Asegúrate de que la ruta al logo es correcta
import esalabLogo from './../../../assets/images/esalab.png';  // Ruta al logo de esalab
import { Auth } from "../../../services/UserService.js";

/**
 * @description View for Login
 * In this view is where the user can log in with their credentials and access the platform if they are valid.
 */
const Login = () => {
  const [validated, setValidated] = useState(false);

  return (
    <div
      style={{
        backgroundImage: `url(${image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: "relative",
      }}
      className="min-vh-100 d-flex flex-row align-items-center"
    >
      {/* Logo en la esquina superior izquierda */}
      <img 
        src={logo} 
        alt="Logo" 
        style={{
          position: "absolute", 
          top: "20px", 
          left: "20px", 
          width: "200px",
        }} 
      />
      
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4" 
                style={{ 
                  paddingBottom: "0",
                }}>
                <CCardBody style={{ paddingBottom: "0" }}>
                  <CForm onSubmit={(e) => Auth(e, setValidated)}>
                    <h1>Inicia sesión</h1>
                    <p>¿No tienes una cuenta? Comienza</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        id="userName"
                        placeholder="Usuario"
                        autoComplete="username"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        id="password"
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CLink 
                        className="mb-3"
                        onClick={() => window.location.href = "/EnterEmail"}
                      >
                        ¿Has olvidado tu contraseña?
                      </CLink>
                    </CRow>
                    <CRow>
                      <div className="d-grid gap-2">
                        <CButton type="submit" color="secondary" style={{ color: "white" }}>
                          Acceder
                        </CButton>
                      </div>
                    </CRow>
                  </CForm>
                </CCardBody>
                
                {/* Logo de esalab debajo del formulario */}
                <CRow className="justify-content-center">
                  <img 
                    src={esalabLogo} 
                    alt="ESALAB Logo" 
                    style={{ 
                      marginTop: "20px", 
                      maxWidth: "80%", 
                      height: "auto" 
                    }} 
                  />
                </CRow>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
