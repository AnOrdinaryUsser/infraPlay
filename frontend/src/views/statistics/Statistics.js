import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CContainer,
  CRow,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useNavigate } from 'react-router-dom';
import { cilChart, cilXCircle, cilImage, cilDescription, cilTrash } from "@coreui/icons";
import Papa from "papaparse"; // Importa PapaParse para procesar el CSV
import { refreshToken } from "../../services/UserService.js";
import { uploadSessionData, fetchSessionStats, deleteSession } from "../../services/StatisticsService.js"; // Importa el servicio

const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;

const Statistics = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [visible, setVisible] = useState(false);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [institute, setInstitute] = useState("");

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
    const loadStats = async () => {
      try {
        const data = await fetchSessionStats(userName); // Pasamos userName
        setStats(data); // Actualiza el estado con los datos recibidos
      } catch (err) {
        setError("Error al cargar estadísticas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userName) { 
      loadStats(userName);
    } 
  }, [userName]);

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
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    } else {
      alert("Por favor, sube un archivo CSV.");
    }
  };

  const handleFormSubmit = () => {
    if (!sessionName || !csvFile) {
      alert("Por favor, completa todos los campos.");
      return;
    }
  
    Papa.parse(csvFile, {
      complete: (result) => {
        const sessionData = result.data.map((row) => ({
          startTime: row["Tiempo de inicio"],
          endTime: row["Tiempo de finalización"],
          totalScore: row["Puntuación total"],
          maxScore: row["Puntuación máxima"],
          duration: row["Duración"],
        }));
  
        uploadSessionData(sessionName, sessionData, userName) // Pasar el userName
          .then(() => setVisible(false))
          .catch((error) => console.error("Error al crear la sesión", error));
      },
      header: true,
    });
  };

  const handleDeleteSession = async (sessionGroupId) => {
    const confirmation = window.confirm("¿Estás seguro de que deseas eliminar esta sesión?");
    if (confirmation) {
      try {
        await deleteSession(sessionGroupId);
        // Aquí puedes actualizar la lista de estadísticas después de eliminar la sesión
        setStats(stats.filter(game => game.sessionGroupId !== sessionGroupId));
      } catch (error) {
        console.error("Error al eliminar la sesión:", error);
      }
    }
  };

  return (
    <>
      <h1 className="mb-4">Estadísticas de Juegos</h1>
      <CContainer fluid>
        <CRow>
          <CTable className="mb-4">
            <CTableHead color="secondary">
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Juego</CTableHeaderCell>
                <CTableHeaderCell scope="col">Número de veces jugado</CTableHeaderCell>
                <CTableHeaderCell scope="col">Fecha de juego</CTableHeaderCell>
                <CTableHeaderCell scope="col">Mejor puntuación</CTableHeaderCell>
                <CTableHeaderCell scope="col">Mejor tiempo</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {stats.map((game, index) => {
                const formattedDate = new Date(game.firstStartTime).toLocaleDateString("es-ES");
                return (
                  <CTableRow key={index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{game.sessionName}</CTableDataCell>
                    <CTableDataCell>{game.timesPlayed}</CTableDataCell>
                    <CTableDataCell>{formattedDate}</CTableDataCell>
                    <CTableDataCell>{game.highestMaxScore}</CTableDataCell>
                    <CTableDataCell>{game.shortestDuration}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        style={{
                          backgroundColor: "#4caf50",
                          borderColor: "#4caf50",
                        }}
                        size="sm"
                        onClick={() => navigate(`/session?game=${game.sessionGroupId}`)}
                      >
                        <CIcon size="xs" icon={cilChart} />
                      </CButton>
                      {/* Botón para eliminar */}
                      <CButton
                        style={{
                          backgroundColor: "#f44336",
                          borderColor: "#f44336",
                          marginLeft: '10px'
                        }}
                        size="sm"
                        onClick={() => handleDeleteSession(game.sessionGroupId)}
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
          aria-pressed="true"
          style={{ color: "white" }}
          onClick={() => setVisible(true)}
        >
          Subir sesión de juego
        </CButton>

        {/* Modal */}
        <CModal visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>Subir estadísticas</CModalHeader>
          <CModalBody>
            <CForm>
            <CInputGroup className="mb-3">
            <CFormInput
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="Introduce el nombre de la sesión"
              />
              </CInputGroup>
              <CInputGroup className="mb-3">
              <CInputGroupText>
                  <CIcon icon={cilDescription} />
                </CInputGroupText>
              <CFormInput
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
              </CInputGroup>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Cancelar
            </CButton>
            <CButton color="success" onClick={handleFormSubmit}>
              Subir
            </CButton>
          </CModalFooter>
        </CModal>
      </CContainer>
    </>
  );
};

export default Statistics;