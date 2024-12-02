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
export const uploadSessionData = async (sessionName, sessionData, userName) => {
  try {
    const groupResponse = await axios.post(
      `http://${IP_SERVER}:${PORT_BACKEND}/sessions/groups`,
      { sessionName, userName } // Enviar el userName
    );

    const sessionGroupId = groupResponse.data.sessionGroupId;

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
export const fetchSessionStats = async (userName) => {
  try {
    const response = await axios.get(`http://${IP_SERVER}:${PORT_BACKEND}/sessions/stats`, {
      params: { userName }, // Pasamos el userName como parámetro
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener estadísticas de sesión:", error);
    throw error;
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

export const deleteSession = async (sessionGroupId) => {
  try {
    const response = await axios.delete(`http://${IP_SERVER}:${PORT_BACKEND}/sessions/${sessionGroupId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar la sesión');
  }
};