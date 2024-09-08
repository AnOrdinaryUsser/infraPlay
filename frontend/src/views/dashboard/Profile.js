import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  CButton,
  CCol,
  CFormInput,
  CRow,
  CContainer,
  CForm,
  CImage,
} from "@coreui/react";
import { refreshToken, modifyUser } from "../../services/UserService.js";

const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;

/**
 * @description View for Profile
 * This view will display the data of the user who is logged in to the system. In addition, you can edit the data of the logged in user.
 */
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
  const [profilePicture, setProfilePicture] = useState(""); // Nuevo estado para la imagen de perfil

  const buttonHandler = () => {
    setVisibility(!visibility);
    setShow(!show);
    setEdit(!edit);
    console.log(show);
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
            <CImage
              src={profilePicture}
              width={300}
              height={300}
              style={{ borderRadius: '50%' }}
            />
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
          <p className="mb-4"></p>
        </CRow>
      </CContainer>
    </>
  );
};

export default Profile;
