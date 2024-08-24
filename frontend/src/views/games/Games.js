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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilTrash, cilImage, cilPencil } from "@coreui/icons";
import {
  refreshToken,
  getUsers,
  deleteUser,
  addUser,
} from "../../services/UsersService.js";
import { getSections } from "../../services/SectionsService.js";
import { addGame, getGamesBySectionId, editGame, deleteGame } from "../../services/GamesService.js";


const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;

/**
 * @description View for AdminDashboard
 * This view will display the data of the user who is logged in to the system. In addition, you can edit the data of the logged in user.
 */
const AdminDashboard = () => {
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
  const [gameName, setGameName] = useState("");
  const [gameUrl, setGameUrl] = useState("");
  const [gameImage, setGameImage] = useState(null);

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
    setGameName(game.name);
    setGameUrl(game.gameUrl);
    setEditGameModalVisible(true);
  };

  const handleEditGame = async (e) => {
      e.preventDefault();
      try {
          await editGame(gameToEdit.id, gameName, gameUrl, gameImage);
          const gamesData = await getGamesBySectionId(sections[activeKey].id);
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
              const gamesData = await getGamesBySectionId(sections[activeKey].id);
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

export default AdminDashboard;
