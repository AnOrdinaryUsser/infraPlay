import axios from "axios";

const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;
/*
export const uploadSessionData = async (sessionName, sessionData) => {
  try {
    const response = await axios.post(
      `http://${IP_SERVER}:${PORT_BACKEND}/sessions/upload`,
      { sessionName, sessionData }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
*/

/**
 * Servicio para subir un nuevo grupo de sesión y sus datos
 * @param {string} sessionName - Nombre del grupo de sesión
 * @param {Array} sessionData - Datos de las sesiones
 */
export const uploadSessionData = async (sessionName, sessionData) => {

  console.log(sessionData);

  try {
    // Crear el grupo de sesión
    const groupResponse = await axios.post(
      `http://${IP_SERVER}:${PORT_BACKEND}/sessions/groups`,
      { sessionName }
    );

    const sessionGroupId = groupResponse.data.sessionGroupId;

    // Subir los datos de sesión vinculados al grupo
    await axios.post(
      `http://${IP_SERVER}:${PORT_BACKEND}/sessions/data`,
      { sessionGroupId, sessionData }
    );

    return { success: true };
  } catch (error) {
    throw error;
  }
};

/**
 * Servicio para obtener estadísticas de sesión.
 * @returns {Promise<Array>} Datos de estadísticas agrupadas.
 */
export const fetchSessionStats = async () => {
  try {
    const response = await axios.get(`http://${IP_SERVER}:${PORT_BACKEND}/sessions/stats`);
    return response.data; // Devuelve los datos al frontend
  } catch (error) {
    console.error("Error al obtener estadísticas de sesión:", error);
    throw error; // Lanza el error para que pueda manejarse en el frontend
  }
};

/**
 * Servicio para obtener datos y estadísticas para el gráfico de un grupo de sesión
 * @param {number} sessionGroupId - ID del grupo de sesión
 * @returns {Promise<Object>} - Datos y estadísticas del gráfico
 */
export const fetchSessionGraphAndStats = async (sessionGroupId) => {
  try {
      const response = await axios.get(`http://${IP_SERVER}:${PORT_BACKEND}/sessions/graph-stats/${sessionGroupId}`);
      return response.data;
  } catch (error) {
      console.error('Error al obtener datos y estadísticas del gráfico:', error);
      throw error;
  }
};