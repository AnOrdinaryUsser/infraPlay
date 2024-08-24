/**
 * Module for users management
 * @module ImgRoadService
 */
import axios from "axios";

const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;
const PORT_FRONTEND = process.env.REACT_APP_PORT_FRONTEND;
const PORT_PROXY = process.env.REACT_APP_PORT_PROXY;
const API_URL = `http://${IP_SERVER}:${PORT_BACKEND}`;


/**
 * Take a photo and sent to Robflow model
 * @method handleCaptureImage
 */
export const handleCaptureImage = async () => {
  try {
    const result = await axios.post(`http://${IP_SERVER}:${PORT_PROXY}/captureImage`);
  } catch (error) {
    alert('Error capturing image. Please try again.');
  }
};
export const handleArduinoDoors = () => {
  return new Promise((resolve, reject) => {
    axios.post(`http://${IP_SERVER}:${PORT_PROXY}/closeDoors`)
      .then(response => {
        console.log("Puertas cerradas exitosamente");
        resolve(response.data); // Resuelve la promesa con cualquier dato necesario
      })
      .catch(error => {
        console.error('Error al cerrar las puertas de Arduino:', error);
        reject(error); // Rechaza la promesa en caso de error
      });
  });
};


/**
 * Upload analized image to BBDD
 * @method uploadImage
 * @param {file} imageData
 */
export const uploadImage = async (imageData) => {
  try {
    const formData = new FormData();
    formData.append('serialNumber', imageData.serialNumber);
    formData.append('image', imageData.image, imageData.name);
    formData.append('name', imageData.name);

    console.log(imageData.serialNumber);
    console.log(imageData.image);
    console.log(imageData.name);

    const response = await axios.post(`${API_URL}/uploadImage`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // Devolver la respuesta del servidor si es necesario
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Get all images from one user stored in BBDD
 * @method getAllImages
 * @param {String} serialNumber 
 */
export const getAllImages = async (serialNumber) => {
  try {
    console.log("RESPONSE: ", `${API_URL}/getAllImages/${serialNumber}`)
    const response = await axios.get(`${API_URL}/getAllImages/${serialNumber}`);
    return response.data;
  } catch (error) {
    console.error("NO HAY USUARIO");
    throw error;
  }
};

/**
 * Delete one image from concrete user stored in BBDD
 * @method getAllImages
 * @param {String} serialNumber 
 * @param {String} imageName
 */
export const deleteImage = async (serialNumber, imageName) => {
  try {
    const response = await axios.delete(`${API_URL}/deleteImage/${serialNumber}/${imageName}`);
    return response.data; // Devolver la respuesta del servidor si es necesario
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Use ffmpeg to extract some screenshots every x seconds defined by user
 * @method processVideoService
 * @param {file} file 
 * @param {Int} seconds
 */
export const processVideoService = async (file, seconds) => {
  try {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('intValue', seconds.toString()); // Convierte el valor entero a cadena

    const response = await axios.post(`http://${IP_SERVER}:${PORT_PROXY}/processVideo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error en el servicio:', error);
    throw error;
  }
};

/**
 * Get all images from the original video
 * @method processVideoService
 */
export const getImagesFromVideoService = async () => {
  try {
    const response = await axios.get(`http://${IP_SERVER}:${PORT_PROXY}/getImagesFromVideo`);
    return response.data.images;
  } catch (error) {
    console.error('Error en el servicio:', error);
    throw error;
  }
};

/**
 * Converts an object of type image to a string in base 64
 * @method loadImageBase64
 * @param {File} file Object file
 */
export const loadImageBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // Extraer la parte de datos base64
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Converts an object in Base64 string format to a Blob string
 * @method base64ToBlob
 * @param {base64String} base64String String in base64 format
 */
export const base64ToBlob = (base64String) => {
  const cleanedBase64String = base64String.replace(/^data:image\/\w+;base64,/, '');
  const byteCharacters = atob(cleanedBase64String);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/jpg' });

  return blob;
};

/**
 * This method draws the rectangles of each crack class according to the predictions received by the model.
 * @method drawBoundingBoxes64
 * @param {Base64} originalImageBase64 String in base64 format
 * @param {Object} imageData Object with the original info of an image
 */
export const drawBoundingBoxes64 = (originalImageBase64, imageData) => {
  return new Promise((resolve, reject) => {
    const originalImage = new Image();
    originalImage.src = `data:image/jpeg;base64,${originalImageBase64}`;

    originalImage.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = originalImage.width;
      canvas.height = originalImage.height;

      ctx.drawImage(originalImage, 0, 0);

      const classColors = {
        D00: "rgba(255, 0, 0, 0.7)", // Red
        D10: "rgba(0, 255, 0, 0.7)", // Green
        D20: "rgba(0, 0, 255, 0.7)", // Blue
        D30: "rgba(255, 255, 0, 0.7)", // Yellow
        D40: "rgba(255, 0, 255, 0.7)" // Purple
      };

      // Draw predictions
      imageData.predictions.forEach((prediction) => {
        const { x, y, width, height, class: predictionClass } = prediction;

        const x1 = x - width / 2;
        const y1 = y - height / 2;
        const x2 = x + width / 2;
        const y2 = y + height / 2;

        ctx.strokeStyle = classColors[predictionClass] || "rgba(0, 0, 0, 0.7)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.rect(x1, y1, width, height);
        ctx.stroke();

        ctx.fillStyle = classColors[predictionClass] || "rgba(0, 0, 0, 0.7)";
        if (width < 60) {
          ctx.fillRect(x1, y1, 33, -20);
        } else {
          ctx.fillRect(x1, y1, 33, -20);
        }

        ctx.font = "12px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(predictionClass, x1 + 5, y1 - 5);
      });

      const base64Image = canvas.toDataURL("image/jpeg");
      resolve(base64Image);
    });
      originalImage.addEventListener("error", (error) => {
      reject(error);
    });
  });
};

/**
 * This method draws the rectangles of each crack class according to the predictions received by the model.
 * @method generateUniqueName
 */
export const generateUniqueName = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().replace(/[-:.]/g, '').replace('T', '_').split('.')[0];
  return `image_${formattedDate}`;
};

