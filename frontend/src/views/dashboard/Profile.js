import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCol,
  CFormInput,
  CRow,
  CContainer,
  CForm,
  CImage,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import { refreshToken, modifyUser } from "../../services/UserService.js";
import { cilPencil } from "@coreui/icons";
import cameraIcon from "../../assets/images/camera.png";

const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;

const Profile = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [institute, setInstitute] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(true);
  const [edit, setEdit] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  const buttonHandler = () => {
    setVisibility(!visibility);
    setShow(!show);
    setEdit(!edit);
  };

  const handleProfilePictureClick = () => {
    setModalVisible(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewProfilePicture(file);
  };

  const handleSaveProfilePicture = async () => {
    if (newProfilePicture) {
      const formData = new FormData();
      formData.append("profilePicture", newProfilePicture);

      try {
        const response = await axios.post(
          `http://${IP_SERVER}:${PORT_BACKEND}/updateProfilePicture`, // Asegúrate de que esta ruta sea correcta
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setProfilePicture(response.data.profilePictureUrl); // Actualizamos la imagen de perfil
        setModalVisible(false); // Cerramos el modal después de guardar
      } catch (error) {
        console.error("Error al actualizar la imagen de perfil:", error);
      }
    }
  };

  useEffect(() => {
    refreshToken(
      setToken,
      setExpire,
      setName,
      setSurname,
      setInstitute,
      setUserName,
      setEmail,
      setProfilePicture
    );
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

  return (
    <>
      <h1 className="mb-4">Bienvenido de nuevo 👋: {name} {surname}</h1>
      <h2 className="mb-4">Mis datos</h2>
      <CContainer>
        <CRow>
          <CCol md={15} lg={15} xl={4} className="d-flex justify-content-center">
            {/* Contenedor para la imagen y el ícono */}
            <div
              style={{
                position: "relative",
                display: "inline-block",
                width: "300px",
                height: "300px",
              }}
              onClick={handleProfilePictureClick} // Abrir el modal al hacer clic en la imagen
            >
              {/* Imagen con efecto de desvanecimiento */}
              <CImage
                src={profilePicture || "default-profile-picture.jpg"} // Asegúrate de que haya una imagen por defecto
                width="300px"
                height="300px"
                style={{
                  borderRadius: "50%",
                  transition: "opacity 0.3s ease",
                  opacity: 1,
                  cursor: "pointer",
                }}
                onMouseOver={(e) => (e.target.style.opacity = 0.6)}
                onMouseOut={(e) => (e.target.style.opacity = 1)}
              />
              {/* Ícono de lápiz superpuesto */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  width: "100px", // Tamaño del lápiz (ajustable)
                  height: "100px", // Tamaño del lápiz (ajustable)
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.opacity = 1)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.opacity = 0)
                }
              >
                <img
                  src={cameraIcon} // Cambia esto por la URL o ruta de la imagen del lápiz
                  style={{
                    width: "100%", // Ajusta la imagen al tamaño del contenedor
                    height: "100%",
                  }}
                />
              </div>
            </div>
          </CCol>
          <CCol md={20} lg={20} xl={6}>
            <CForm
              className="row g-4"
              validated={validated}
              onSubmit={(e) => modifyUser(e, setValidated)}
            >
              <CCol md={6}>
                <CFormInput
                  type="text"
                  id="nameInput"
                  label="Nombre"
                  defaultValue={name}
                  disabled={visibility}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  id="surname"
                  label="Apellidos"
                  defaultValue={surname}
                  disabled={visibility}
                  required
                />
              </CCol>
              <CCol xs={12}>
                <CFormInput
                  type="text"
                  id="institute"
                  label="Instituto"
                  defaultValue={institute}
                  disabled={visibility}
                  required
                />
              </CCol>
              <CCol xs={12}>
                <CFormInput
                  type="email"
                  id="emailInput"
                  label="Email"
                  defaultValue={email}
                  disabled={visibility}
                  required
                />
              </CCol>
              <CCol xs={12}>
                <CFormInput
                  type="password"
                  id="pass"
                  label="Contraseña"
                  defaultValue={email}
                  disabled={visibility}
                  required
                />
              </CCol>
              <CCol md={12}>
                {show && (
                  <CButton
                    color="secondary"
                    style={{ color: "white" }}
                    aria-pressed="true"
                    onClick={buttonHandler}
                  >
                    Editar
                  </CButton>
                )}
              </CCol>
              <CCol md={3}>
                {edit && (
                  <CButton color="success" aria-pressed="true" type="submit">
                    Guardar
                  </CButton>
                )}
              </CCol>
              <CCol md={3}>
                {edit && (
                  <CButton
                    color="danger"
                    aria-pressed="true"
                    onClick={buttonHandler}
                  >
                    Cancelar
                  </CButton>
                )}
              </CCol>
            </CForm>
          </CCol>
        </CRow>
      </CContainer>

      {/* Modal para actualizar la imagen de perfil */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>Actualizar Imagen de Perfil</CModalHeader>
        <CModalBody>
          <CFormInput type="file" onChange={handleFileChange} />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancelar
          </CButton>
          <CButton color="success" onClick={handleSaveProfilePicture}>
            Guardar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Profile;