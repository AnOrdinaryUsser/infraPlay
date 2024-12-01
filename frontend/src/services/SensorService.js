/**
 * Module for CRUD functions for sensor
 * @module SensorService
 */

import axios from 'axios';

const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;

/**
 * Función para obtener los valores del sensor desde el backend
 * @method getSensorValues
 * @returns {Promise<Object>} Objeto con los valores del sensor
 */
export const getSensorValues = async () => {
  try {
    const response = await axios.get(`http://${IP_SERVER}:${PORT_BACKEND}/sensor`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sensor values:', error);
    throw error;
  }
};

/**
 * Función para guardar o actualizar los valores del sensor
 * @method saveSensorValues
 * @param {Object} sensorData Objeto con los valores a guardar (xmin, xmax, ymin, ymax)
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const saveSensorValues = async (sensorData) => {
  try {
    const { xmin, xmax, ymin, ymax } = sensorData;

    // Validación básica antes de enviar la solicitud
    if (xmin === undefined || xmax === undefined || ymin === undefined || ymax === undefined) {
      console.error('Missing sensor data');
      throw new Error('Missing sensor data');
    }

    const response = await axios.post(`http://${IP_SERVER}:${PORT_BACKEND}/sensor`, {
      xmin,
      xmax,
      ymin,
      ymax,
    });

    return response.data;
  } catch (error) {
    console.error('Error saving sensor values:', error);
    throw error;
  }
};
