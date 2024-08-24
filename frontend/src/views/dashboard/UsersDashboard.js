import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  CButton,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CContainer,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CInputGroup,
  CInputGroupText,
  CBadge,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilTrash, cilUser, cilInstitution, cilCamera } from "@coreui/icons";
import {
  refreshToken,
  getUsers,
  deleteUser,
  addUser,
  Register,
  toggleUserVerification
} from "../../services/UsersService.js";

const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;

/**
 * @description View for AdminDashboard
 * This view will display the data of the user who is logged in to the system. In addition, you can edit the data of the logged in user.
 */
const AdminDashboard = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [users, setUsers] = useState([]);
  const [validated, setValidated] = useState(false);
  const [visible, setVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    refreshToken(setToken, setExpire);
    getUsers(setUsers, token, axiosJWT);
  }, []);

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get(`http://${IP_SERVER}:${PORT_BACKEND}/token`);
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

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

  const handleToggleVerification = async (userName) => {
    try {
      await toggleUserVerification(userName, token);
      // Refresh the users list after toggling
      getUsers(setUsers, token, axiosJWT);
    } catch (error) {
      console.error("Error al cambiar el estado de verificación:", error);
    }
  };

  return (
    <>
      <h1 className="mb-4">Usuarios </h1>
      <CContainer fluid>
        <CRow>
          <CTable className="mb-4" >
            <CTableHead color="secondary">
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                <CTableHeaderCell scope="col">Apellidos</CTableHeaderCell>
                <CTableHeaderCell scope="col">Registrado</CTableHeaderCell>
                <CTableHeaderCell scope="col">Usuario</CTableHeaderCell>
                <CTableHeaderCell scope="col">Correo</CTableHeaderCell>
                <CTableHeaderCell scope="col">Rol</CTableHeaderCell>
                <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {users.map((user, index) => {
                const formattedDate = new Date(user.createdAt).toLocaleDateString('es-ES');
                const badgeColor = user.verified === 1 ? 'success' : 'danger';
                const badgeText = user.verified === 1 ? 'Verificado' : 'No verificado';
                return (
                  <CTableRow key={index}>
                    <CTableDataCell>{user.id}</CTableDataCell>
                    <CTableDataCell>{user.name}</CTableDataCell>
                    <CTableDataCell>{user.surname}</CTableDataCell>
                    <CTableDataCell>{formattedDate}</CTableDataCell>
                    <CTableDataCell>{user.userName}</CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>{user.role}</CTableDataCell>
                    <CTableDataCell> <CBadge
                        color={badgeColor}
                        onClick={() => handleToggleVerification(user.userName, token)}
                        style={{ cursor: 'pointer' }}
                      >
                        {badgeText}
                      </CBadge></CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        style={{
                          backgroundColor: "#e8463a",
                          borderColor: "#e8463a",
                        }}
                        size="sm"
                        id={user.userName}
                        onClick={deleteUser}
                      >
                        <CIcon size="xs" icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                );
              })}
            </CTableBody>
          </CTable>
        </CRow>
        <CButton
          className="mb-4 d-grid"
          color="secondary"
          style={{ color: "white" }}
          onClick={() => setVisible(true)}
        >
          Añadir usuario
        </CButton>
      </CContainer>
      <CModal
        alignment="center"
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Añadir usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
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
        </CModalBody>
      </CModal>
    </>
  );
};

export default AdminDashboard;
