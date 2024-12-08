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
import { cilViewStream, cilViewColumn, cilImage } from "@coreui/icons";
import { getSections, modifySection } from "../../services/SectionService.js";
import { refreshToken } from "../../services/UserService.js";
import { addGame, getGamesBySectionId, getAllGamesWithSections } from "../../services/GameService.js";

const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_FRONTEND = process.env.REACT_APP_PORT_BACKEND;

/**
 * @description View for Dashboard
 * This view will display the data of the user who is logged in to the system. In addition, you can edit the grid of ur sections and add games.
 */
const Dashboard = () => {
  const [activeKey, setActiveKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [addGameModalVisible, setAddGameModalVisible] = useState(false);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
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
  const [validated, setValidated] = useState(false);
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
    console.log(sections);
  }, [userName]);

 /* useEffect(() => {
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
  }, [activeKey, sections, userName]);
*/
  useEffect(() => {
    if (userName) {
    const fetchGamesWithSections = async () => {
      try {
        console.log(userName);
        const gamesData = await getAllGamesWithSections(userName);
        console.log(gamesData);
        setGames(gamesData);
        console.log(gamesData);
      } catch (error) {
        console.error('Error fetching games with sections:', error);
      }
    };
  
    fetchGamesWithSections();
    }
  }, [activeKey, sections, userName]);  

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
      const sectionId = sections[activeKey]?.id; // Obtiene el ID de la sección seleccionada
      console.log(gameImage);
      
      // Llama al servicio para agregar el juego
      const response = await addGame(gameName, gameUrl, gameImage, sectionId);
      console.log(response.msg);
      
      // Refetch de los juegos después de agregar uno nuevo
      const gamesData = await getAllGamesWithSections(userName);
      setGames(gamesData);
      setAddGameModalVisible(false);
    } catch (error) {
      console.error("Error adding game:", error);
    }
  }; 

  const handleImageClick = (url) => {
    const gameId = url.split('/').pop();  // Extraer el ID del juego del URL
    window.open(`http://${IP_SERVER}:${PORT_FRONTEND}/embed/${gameId}`, '_blank');
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
                  {/* Filtrar juegos para la sección activa */}
                  {[...Array(section.rows)].map((_, rowIndex) => (
                    <CRow key={rowIndex} xs={{ gutterX: 2 }}>
                      {[...Array(section.cols)].map((_, colIndex) => {
                        const gameIndex = rowIndex * section.cols + colIndex;
                        const filteredGames = games.filter(game => game.sectionName === section.name);
                        return (
                          <CCol key={colIndex} xs={{ span: 12 / section.cols }}>
                            <div className="p-3">
                              {filteredGames[gameIndex] ? (
                                // Mostrar el juego si existe
                                <CCard className="text-center">
                                  <CCardBody>
                                    <CCardTitle>{filteredGames[gameIndex].name}</CCardTitle>
                                    {filteredGames[gameIndex].image && (
                                      <CImage 
                                        src={`data:image/jpeg;base64,${filteredGames[gameIndex].image}`}
                                        onClick={() => handleImageClick(filteredGames[gameIndex].gameUrl)}
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
                  onClick={() => {
                    const section = sections[activeKey];  // Fetch the current section
                    setSelectedSection(section);
                    setEditSectionName(section.name);
                    setEditSectionRows(section.rows);
                    setEditSectionCols(section.cols);
                    setModalVisible(true);  // Open modal
                  }}>
                  Editar cuadrícula
                </CButton>
              </CTabPane>
            ))}
          </CTabContent>
        </CRow>
      </CContainer>
    </>
  );
};

export default Dashboard;
