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
  CBadge,
  CRow,
  CCol,
  CCard,
  CCardBody,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { CChart } from '@coreui/react-chartjs'
import { CWidgetStatsF } from '@coreui/react'
import { useNavigate } from 'react-router-dom';
import { cilChart, cilXCircle, cilClock, cilChartLine, cilGraph, cilSpeedometer, cilAvTimer, cilArrowThickBottom, cilArrowThickTop } from "@coreui/icons";
import { refreshToken } from "../../services/UserService.js";
import { fetchSessionGraphAndStats } from '../../services/StatisticsService.js';
import { useLocation } from "react-router-dom";

const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;

const Session = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [gameStats, setGameStats] = useState([]);
  const [visible, setVisible] = useState(false);
  const [durations, setDurations] = useState([]);
  const [totalScores, setTotalScores] = useState([]);
  const [sessionName, setSessionName] = useState('');
  const [statistics, setStatistics] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // Extrae los parámetros de consulta
  const sessionGroupId = queryParams.get("game"); // Obtiene el valor de 'game'

  useEffect(() => {
    refreshToken(setToken, setExpire);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await fetchSessionGraphAndStats(sessionGroupId);
            setDurations(data.durations);
            setTotalScores(data.totalScores);
            setSessionName(data.sessionName);
            setStatistics(data.statistics);
            console.log(data.statistics);
        } catch (error) {
            console.error('Error al cargar los datos y estadísticas:', error);
        }
    };

    fetchData();
}, [sessionGroupId]);

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

  const getStyle = (property) => {
    return getComputedStyle(document.documentElement).getPropertyValue(property);
  };

  const convertDuration = (duration) => {
    const number = parseInt(duration.split(' ')[0]); // Obtener la parte numérica
    const unit = duration.split(' ')[1]; // Obtener la unidad (segundos o minutos)
  
    if (unit === 'segundos') {
      // Si la duración está en segundos, conviértelo a minutos si es mayor o igual a 60
      if (number >= 60) {
        return number / 60; // Devuelve los minutos como número
      } else {
        return number; // Devuelve los segundos como número
      }
    }
  
    // Si la duración ya está en minutos, devuelve el número de minutos
    return number;
  };

  console.log(durations);
  const processDurations = (durations) => {
    const durationsInSeconds = durations.filter(duration => duration.includes('segundos')).map(duration => parseInt(duration.split(' ')[0]));
    const durationsInMinutes = durations.filter(duration => duration.includes('minutos')).map(duration => parseInt(duration.split(' ')[0]));
  
    return {
      durationsInSeconds,
      durationsInMinutes,
    };
  };
  
  const { durationsInSeconds, durationsInMinutes } = processDurations(durations);
  

  return (
    <>
      <h1 className="mb-4">📊 Estadísticas de {sessionName}</h1>
      <CContainer fluid>
        <CRow>
          <CCol>
          <CChart
              type="bar"
              data={{
                labels: Array.from({ length: Math.max(durationsInSeconds.length, durationsInMinutes.length) }, (_, i) => `Partida ${i + 1}`),
                datasets: [
                  durationsInSeconds.length > 0 && {
                    label: 'Duración (segundos)',
                    data: durationsInSeconds,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  },
                  durationsInMinutes.length > 0 && {
                    label: 'Duración (minutos)',
                    data: durationsInMinutes,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                  },
                ].filter(Boolean), // Filtrar datasets vacíos
              }}
              options={{
                plugins: {
                  legend: {
                    labels: {
                      color: getStyle('--cui-body-color'),
                    },
                  },
                },
                scales: {
                  x: {
                    grid: {
                      color: getStyle('--cui-border-color-translucent'),
                    },
                    ticks: {
                      color: getStyle('--cui-body-color'),
                    },
                  },
                  y: {
                    grid: {
                      color: getStyle('--cui-border-color-translucent'),
                    },
                    ticks: {
                      color: getStyle('--cui-body-color'),
                    },
                  },
                },
              }}
            />
          </CCol>

          <CCol>
            <CChart
              type="bar"
              data={{
                labels: Array.from({ length: totalScores.length }, (_, i) => `Jugador ${i + 1}`),
                datasets: [
                  {
                    label: 'Puntuación Total',
                    data: totalScores,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    labels: {
                      color: getStyle('--cui-body-color'),
                    }
                  }
                },
                scales: {
                  x: {
                    grid: {
                      color: getStyle('--cui-border-color-translucent'),
                    },
                    ticks: {
                      color: getStyle('--cui-body-color'),
                    },
                  },
                  y: {
                    grid: {
                      color: getStyle('--cui-border-color-translucent'),
                    },
                    ticks: {
                      color: getStyle('--cui-body-color'),
                    },
                  },
                },
              }}
            />
          </CCol>
        </CRow>
        {/* Stats Section */}
        <CRow className="mb-4">
          <CCol xs="12" sm="6" md="4">
            <CWidgetStatsF
              color="primary"
              icon={<CIcon icon={cilClock} size="xl" />}
              value={statistics?.avgDuration ?? "Cargando..."}
              title="Duración total del juego"
              className="m-2 text-white"
            />
          </CCol>

          <CCol xs="12" sm="6" md="4">
            <CWidgetStatsF
              color="success"
              icon={<CIcon icon={cilAvTimer} size="xl" />}
              value={statistics?.totalDuration ?? "Cargando..."}
              title="Duración promedio de sesiones"
              className="m-2 text-white"
            />
          </CCol>

          <CCol xs="12" sm="6" md="4">
            <CWidgetStatsF
              color="warning"
              icon={<CIcon icon={cilArrowThickTop} size="xl" />}
              value={statistics?.longestDuration ?? "Cargando..."}
              title="Partida más larga"
              className="m-2 text-white"
            />
          </CCol>
        </CRow>

        <CRow className="mb-4">
          <CCol xs="12" sm="6" md="4">
            <CWidgetStatsF
              color="warning"
              icon={<CIcon icon={cilArrowThickBottom} size="xl" />}
              value={statistics?.shortestDuration ?? "Cargando..."}
              title="Partida más corta"
              className="m-2 text-white"
            />
          </CCol>

          <CCol xs="12" sm="6" md="4">
            <CWidgetStatsF
              color="danger"
              icon={<CIcon icon={cilSpeedometer} size="xl" />}
              value={statistics?.avgTotalScore ?? "Cargando..."}
              title="Puntuación total promedio"
              className="m-2 text-white"
            />
          </CCol>

          <CCol xs="12" sm="6" md="4">
            <CWidgetStatsF
              color="secondary"
              icon={<CIcon icon={cilChartLine} size="xl" />}
              value={statistics?.avgMaxScore ?? "Cargando..."}
              title="Puntuación máxima promedio"
              className="m-2 text-white"
            />
          </CCol>
        </CRow>
      </CContainer>
    </>
  );
};

export default Session;