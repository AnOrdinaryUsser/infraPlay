import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCamera, cilInstitution, cilLockLocked, cilUser } from "@coreui/icons";
import { Register } from "../../../services/UsersService.js";

/**
 * @description View for Register
 * In this view the user can register.
 */
const Registered = () => {
  const [validated, setValidated] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  // Handler for file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      const img = new Image();
      reader.onload = function (event) {
        img.src = event.target.result;
        img.onload = function () {
          if (img.width === img.height) {
            const base64 = reader.result;
            setProfilePicture(base64); // Guarda la imagen en base64 en el estado
          } else {
            alert("La imagen debe ser cuadrada (igual ancho y alto).");
            e.target.value = ""; // Resetea el input file
            setProfilePicture(null); // Limpia el estado
          }
        };
      };
      reader.readAsDataURL(file); // Lee el archivo como una URL de datos base64
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm
                  validated={validated}
                  onSubmit={(e) => Register(e, setValidated, profilePicture)}
                >
                  <h1>Registrate</h1>
                  <p className="text-medium-emphasis">Crea tu cuenta</p>
                  {/* Nombre y Apellidos */}
                  <CInputGroup className="mb-3">
                    <CFormInput
                      placeholder="Nombre"
                      id="name"
                      autoComplete="name"
                      required
                    />
                    <CFormInput
                      placeholder="Apellidos"
                      id="surname"
                      autoComplete="surname"
                      required
                    />
                  </CInputGroup>
                  {/* Institución */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilInstitution} />
                    </CInputGroupText>
                       <CFormInput
                      placeholder="Institución a la que perteneces"
                      id="institute"
                      autoComplete="institute"
                      required
                    />
                  </CInputGroup>
                  {/* Usuario */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Usuario"
                      id="userName"
                      autoComplete="userName"
                      required
                    />
                  </CInputGroup>
                  {/* Email */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="email"
                      id="email"
                      placeholder="Email"
                      autoComplete="email"
                      required
                    />
                  </CInputGroup>
                  {/* Imagen de Perfil */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilCamera} />
                    </CInputGroupText>
                    <CFormInput
                      type="file"
                      id="profilePicture"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </CInputGroup>
                  {/* Contraseña */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Contraseña"
                      autoComplete="new-password"
                      id="pass"
                      required
                    />
                  </CInputGroup>
                  {/* Repite Contraseña */}
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repite tu contraseña"
                      autoComplete="new-password"
                      id="repeatPass"
                      required
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton type="submit" color="success" aria-pressed="true">
                      Crear Cuenta
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Registered;
