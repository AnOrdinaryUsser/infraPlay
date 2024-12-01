/**
 * @file Controller to handle frontend sensor requests
 */
import Sensor from "../models/SensorModel.js";

// Obtener los valores actuales del sensor
export const getSensorValues = async (req, res) => {
  try {
    const sensor = await Sensor.findOne();
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor values not found' });
    }
    return res.json(sensor);
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving sensor values' });
  }
};

// Guardar/Actualizar los valores del sensor
export const saveSensorValues = async (req, res) => {
  const { xmin, xmax, ymin, ymax } = req.body;
  
  // Validación básica de los valores
  if (xmin === undefined || xmax === undefined || ymin === undefined || ymax === undefined) {
    return res.status(400).json({ message: 'All sensor values must be provided' });
  }

  try {
    let sensor = await Sensor.findOne();
    if (!sensor) {
      // Si no existe, creamos uno nuevo
      sensor = await Sensor.create({ xmin, xmax, ymin, ymax });
    } else {
      // Si ya existe, actualizamos
      sensor.xmin = xmin;
      sensor.xmax = xmax;
      sensor.ymin = ymin;
      sensor.ymax = ymax;
      await sensor.save();
    }

    return res.json({ message: 'Sensor values saved successfully', sensor });
  } catch (err) {
    return res.status(500).json({ message: 'Error saving sensor values' });
  }
};
