import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  CButton,
  CCol,
  CRow,
  CContainer,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormInput,
  CCard,
  CCardBody,
  CCardText,
  CCardTitle,
  CForm,
  CModalTitle,
  CInputGroup,
  CInputGroupText,
  CImage,
} from '@coreui/react';
import CIcon from "@coreui/icons-react";
import { getSections } from "../../services/SectionsService.js";
import { refreshToken } from "../../services/UsersService.js";
import { cilImage } from "@coreui/icons";
import { addGame, getGamesBySectionId } from "../../services/GamesService.js";

const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;

const Dashboard = () => {
  const [activeKey, setActiveKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [addGameModalVisible, setAddGameModalVisible] = useState(false);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [validated, setValidated] = useState(false);
  const [grid, setGrid] = useState({ rows: 0, cols: 0 });
  const [sections, setSections] = useState([]);
  const [userName, setUserName] = useState("");
  const [games, setGames] = useState([]); // Estado para almacenar los juegos

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [institute, setInstitute] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");

  // States for game form
  const [gameName, setGameName] = useState("");
  const [gameUrl, setGameUrl] = useState("");
  const [gameImage, setGameImage] = useState(null);

  const [sectionName, setSectionName] = useState(0);
  const [sectionRows, setSectionRows] = useState(0);
  const [sectionCols, setSectionCols] = useState(0);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [editSectionName, setEditSectionName] = useState("");
  const [editSectionRows, setEditSectionRows] = useState(0);
  const [editSectionCols, setEditSectionCols] = useState(0);

  useEffect(() => {
    // Refresh token and get user info
    const fetchUserData = async () => {
      try {
        await refreshToken(setToken, setExpire, setName, setSurname, setInstitute, setUserName, setEmail);
      } catch (error) {
        console.error("Error refreshing token", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userName) {
      // Load sections when the userName is available
      getSections(userName, setSections).catch(error => console.error("Error fetching sections", error));
    }
  }, [userName]);

  useEffect(() => {
    const fetchGames = async () => {
      if (sections[activeKey]) {
        try {
          const sectionId = sections[activeKey].id;
          const gamesData = await getGamesBySectionId(sectionId);
          setGames(gamesData);
          console.log(gamesData);
        } catch (error) {
          console.error("Error fetching games", error);
        }
      }
    };
    fetchGames();
  }, [activeKey, sections]);

  const updateGrid = () => {
    setGrid({ rows, cols });
    setModalVisible(false);
  };

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
      } else {
        config.headers.Authorization = `Bearer ${token}`;
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
        const base64 = reader.result;
        setGameImage(base64); // Guarda la imagen en base64 en el estado
        };
      };
      reader.readAsDataURL(file); 
    }
  };

  const handleAddGame = async (e) => {
    e.preventDefault();
    try {
        const sectionId = sections[activeKey].id; 
        console.log(gameImage);
        const response = await addGame(gameName, gameUrl, gameImage, sectionId);
        console.log(response.msg); 
        // Refetch games after adding a new one
        const gamesData = await getGamesBySectionId(sectionId);
        setGames(gamesData);
        setAddGameModalVisible(false);
    } catch (error) {
        console.error("Error adding game:", error);
    }
  };

  const handleImageClick = (url) => {
    const gameId = url.split('/').pop();  // Extraer el ID del juego del URL
    window.open(`http://192.168.1.50:3000/embed/${gameId}`, '_blank');
  };

  const handleModifySection = async (e) => {
    e.preventDefault();
    const updatedSection = {
      ...selectedSection,
      name: editSectionName,
      rows: editSectionRows,
      cols: editSectionCols,
    };
    try {
      await modifySection(updatedSection, setValidated);
      setEditModalVisible(false);
      alert("Sección modificada con éxito");
    } catch (error) {
      console.error("Error al modificar la sección:", error);
      alert("Error al modificar la sección");
    }
  };

  const handleEdit = (section) => {
    setSelectedSection(section);
    setEditSectionName(section.name);
    setEditSectionRows(section.rows);
    setEditSectionCols(section.cols);
    setEditModalVisible(true);
  };

  return (
    <>
      <CContainer>
        <CRow>
          <CNav variant="tabs" role="tablist">
            {sections.map((section, index) => (
              <CNavItem key={index}>
                <CNavLink
                  style={{ color: 'black' }}
                  active={activeKey === index}
                  onClick={() => setActiveKey(index)}
                >
                  {section.name}
                </CNavLink>
              </CNavItem>
            ))}
          </CNav>
          <CTabContent>
            {sections.map((section, index) => (
              <CTabPane 
                key={index}
                role="tabpanel" 
                aria-labelledby={`section-${section.id}-tab`}
                visible={activeKey === index}
              >
                <CContainer>
                  {[...Array(section.rows)].map((_, rowIndex) => (
                    <CRow key={rowIndex} xs={{ gutterX: 2 }}>
                      {[...Array(section.cols)].map((_, colIndex) => {
                        const gameIndex = rowIndex * section.cols + colIndex;
                        return (
                          <CCol key={colIndex} xs={{ span: 12 / section.cols }}>
                            <div className="p-3">
                              {games[gameIndex] ? (
                                // Mostrar el juego si existe
                                <CCard className="text-center">
                                  <CCardBody>
                                    <CCardTitle>{games[gameIndex].name}</CCardTitle>
                                    {games[gameIndex].image && (
                                      <CImage 
                                        src={`data:image/jpeg;base64,${games[gameIndex].image}`}
                                        onClick={() => handleImageClick(games[gameIndex].gameUrl)}
                                        style={{  cursor: 'pointer', 
                                                  maxWidth: '50%',                                            
                                                  height: 'auto', }} 
                                      />
                                    )}
                                  </CCardBody>
                                </CCard>
                              ) : (
                                // Mostrar el botón para añadir un juego si no hay juego en esta celda
                                <CCard className="text-center">
                                  <CCardBody>
                                    <CCardTitle>Añade tu juego en H5P</CCardTitle>
                                    <CCardText>Pulsa el botón de añadir para poder importar tu juego</CCardText>
                                    <CButton 
                                      color="secondary"
                                      style={{ color: "white" }}
                                      onClick={() => setAddGameModalVisible(true)}>Añadir juego</CButton>
                                  </CCardBody>
                                </CCard>
                              )}
                            </div>
                          </CCol>
                        );
                      })}
                    </CRow>
                  ))}
                </CContainer>
                <CButton 
                  color="secondary"
                  style={{ color: "white" }}
                  onClick={() => setModalVisible(true)}>
                Editar cuadrícula
              </CButton>
              </CTabPane>
            ))}
          </CTabContent>
        </CRow>

        {/* Modal for grid settings */}
        <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
          <CModalHeader>Personaliza tu cuadrícula</CModalHeader>
          <CModalBody>
            <CFormInput
              placeholder="Filas"
              type="number"
              value={editSectionRows}
              onChange={(e) => setEditSectionRows(e.target.value)}
              required
            />
            <CFormInput
             placeholder="Columnas"
             type="number"
             value={editSectionRows}
             onChange={(e) => setEditSectionCols(e.target.value)}
             required
            />
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" validated={validated}
      onSubmit={(e) => handleModifySection(e)}>Guardar</CButton>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancel</CButton>
          </CModalFooter>
        </CModal>

        {/* Modal for adding a game */}
        <CModal
          alignment="center"
          visible={addGameModalVisible}
          onClose={() => setAddGameModalVisible(false)}
        >
          <CModalHeader onClose={() => setAddGameModalVisible(false)}>
            <CModalTitle>Añadir Juego</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleAddGame}>
              <CInputGroup className="mb-3">
                <CFormInput
                  placeholder="Nombre del juego"
                  id="gameName"
                  onChange={(e) => setGameName(e.target.value)}
                  required
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormInput
                  type="url"
                  placeholder="URL del juego"
                  id="gameUrl"
                  onChange={(e) => setGameUrl(e.target.value)}
                  required
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilImage} />
                </CInputGroupText>
                <CFormInput
                  type="file"
                  id="gameImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </CInputGroup>
              <div className="d-grid">
                <CButton type="submit" color="success" aria-pressed="true">
                  Añadir Juego
                </CButton>
              </div>
            </CForm>
          </CModalBody>
        </CModal>
      </CContainer>
    </>
  );
};

export default Dashboard;
