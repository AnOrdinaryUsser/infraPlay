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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilTrash, cilImage, cilPencil } from "@coreui/icons";
import { refreshToken } from "../../services/UserService.js";
import { getSections } from "../../services/SectionService.js";
import { addGame, getGamesBySectionId, editGame, deleteGame, getAllGamesWithSections } from "../../services/GameService.js";


const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;

/**
 * @description View for Games
 * This view shows you a list of games that are associated to a user. In addition, you can add, delete and modify games.
 */
const Games = () => {
  const [activeKey, setActiveKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [addGameModalVisible, setAddGameModalVisible] = useState(false);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [grid, setGrid] = useState({ rows: 0, cols: 0 });
  const [sections, setSections] = useState([]);
  const [userName, setUserName] = useState("");
  const [games, setGames] = useState([]); // Estado para almacenar los juegos
  const [visible, setVisible] = useState(false);
  const [validated, setValideted] = useState(false);
  const [section, setsection] = useState(false);
  const [editGameModalVisible, setEditGameModalVisible] = useState(false);
  const [gameToEdit, setGameToEdit] = useState(null);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [institute, setInstitute] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");

  // States for game form
  const [gameId, setGameId] = useState("");
  const [gameName, setGameName] = useState("");
  const [gameUrl, setGameUrl] = useState("");
  const [gameImage, setGameImage] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

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
    const fetchGamesWithSections = async () => {
      try {
        const gamesData = await getAllGamesWithSections();
        console.log(gamesData);
        setGames(gamesData);
        console.log(gamesData);
      } catch (error) {
        console.error('Error fetching games with sections:', error);
      }
    };
  
    fetchGamesWithSections();
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

  const handleAddGame = async (e) => {
    e.preventDefault();
    try {
      const sectionId = sections[activeKey]?.id; // Obtiene el ID de la sección seleccionada
      console.log(gameImage);
      
      // Llama al servicio para agregar el juego
      const response = await addGame(gameName, gameUrl, gameImage, sectionId);
      console.log(response.msg);
      
      // Refetch de los juegos después de agregar uno nuevo
      const gamesData = await getAllGamesWithSections();
      setGames(gamesData);
      setAddGameModalVisible(false);
    } catch (error) {
      console.error("Error adding game:", error);
    }
  };  

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

  const handleEditButtonClick = (game) => {
    setGameToEdit(game);
    setGameId(game.id); // Establece el ID del juego seleccionado
    setGameName(game.name);
    setGameUrl(game.gameUrl);
    setSelectedSectionId(game.sectionId); // Si `sectionId` está disponible en el objeto `game`
    setEditGameModalVisible(true);
  };  

  const handleEditGame = async (e) => {
    e.preventDefault();
    console.log(gameId);
    try {
      // Llamada al servicio para editar el juego
      const response = await editGame(gameId, gameName, gameUrl, gameImage, selectedSectionId);
      console.log(response.msg);
  
      // Actualizar la lista de juegos después de la edición
      const gamesData = await getAllGamesWithSections();
      setGames(gamesData);
      setEditGameModalVisible(false);
    } catch (error) {
      console.error("Error editing game:", error);
    }
  };
  

  const handleDeleteGame = async (gameId) => {
      if (window.confirm("¿Estás seguro de que deseas eliminar este juego?")) {
          try {
              await deleteGame(gameId);
              const gamesData = await getAllGamesWithSections();
              setGames(gamesData);
          } catch (error) {
              console.error("Error deleting game:", error);
          }
      }
  };

  return (
    <>
      <h1 className="mb-4">Juegos </h1>
      <CContainer fluid>
        <CTable className="mb-4" >
          <CTableHead color="secondary">
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
              <CTableHeaderCell scope="col">URL</CTableHeaderCell>
              <CTableHeaderCell scope="col">Sección</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {games.map((game, index) => {
              return (
                <CTableRow key={index}>
                  <CTableDataCell>{index}</CTableDataCell>
                  <CTableDataCell>{game.name}</CTableDataCell>
                  <CTableDataCell>{game.gameUrl}</CTableDataCell>
                  <CTableDataCell>{game.sectionName}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      style={{ backgroundColor: "#3a8cbe", borderColor: "#3a8cbe", marginRight: "5px" }}
                      size="sm"
                      onClick={() => handleEditButtonClick(game)}
                    >
                      <CIcon icon={cilPencil}></CIcon>
                    </CButton>
                    <CButton
                      style={{ backgroundColor: "#e8463a", borderColor: "#e8463a" }}
                      size="sm"
                      onClick={() => handleDeleteGame(game.id)}
                    >
                    <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              );
            })}
          </CTableBody>
        </CTable>
        <CButton
          className="mb-4 d-grid"
          color="secondary"
          style={{ color: "white" }}
          onClick={() => setAddGameModalVisible(true)}
        >
          Añadir juego
        </CButton>
      </CContainer>
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
              {/* Campo para el nombre del juego */}
              <CInputGroup className="mb-3">
                <CFormInput
                  placeholder="Nombre del juego"
                  id="gameName"
                  onChange={(e) => setGameName(e.target.value)}
                  required
                />
              </CInputGroup>
              
              {/* Campo para la URL del juego */}
              <CInputGroup className="mb-3">
                <CFormInput
                  type="url"
                  placeholder="URL del juego"
                  id="gameUrl"
                  onChange={(e) => setGameUrl(e.target.value)}
                  required
                />
              </CInputGroup>
              
              {/* Campo para subir imagen */}
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
              
              {/* Desplegable para seleccionar la sección */}
              <CInputGroup className="mb-3">
                <select
                  className="form-select"
                  onChange={(e) => setActiveKey(Number(e.target.value))} // Actualiza el estado con el índice de la sección seleccionada
                  required
                >
                  <option value="" disabled selected>Selecciona una sección</option>
                  {sections.map((section, index) => (
                    <option key={section.id} value={index}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </CInputGroup>
              
              <div className="d-grid">
                <CButton type="submit" color="success" aria-pressed="true">
                  Añadir Juego
                </CButton>
              </div>
            </CForm>
          </CModalBody>
        </CModal>
        <CModal
          alignment="center"
          visible={editGameModalVisible}
          onClose={() => setEditGameModalVisible(false)}
        >
          <CModalHeader onClose={() => setEditGameModalVisible(false)}>
            <CModalTitle>Editar Juego</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleEditGame}>
              <CInputGroup className="mb-3">
                <CFormInput
                  placeholder="Nombre del juego"
                  id="editGameName"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  required
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormInput
                  type="url"
                  placeholder="URL del juego"
                  id="editGameUrl"
                  value={gameUrl}
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
                  id="editGameImage"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <select
                  value={selectedSectionId || ""} // Asegúrate de que tenga un valor inicial válido
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  id="editGameSection"
                  required
                  className="form-select"
                >
                  <option value="">Seleccionar Sección</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </CInputGroup>
              <div className="d-grid">
                <CButton type="submit" color="success" aria-pressed="true">
                  Guardar Cambios
                </CButton>
              </div>
            </CForm>
          </CModalBody>
        </CModal>
    </>
  );
};

export default Games;
