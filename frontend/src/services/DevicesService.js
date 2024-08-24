/**
 * Module for users management
 * @module UsersService
 */
import axios from "axios";
import jwt_decode from "jwt-decode";


const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;
const PORT_FRONTEND = process.env.REACT_APP_PORT_FRONTEND;
const PORT_PROXY = process.env.REACT_APP_PORT_PROXY;


/**
 * Get all devices in system
 * @method getDevices
 * @param {Array} setDevices Array of devices
 */
export const getDevices = async (setDevices) => {
  const response = await axios.get(`http://${IP_SERVER}:${PORT_BACKEND}/devices`, {});
  console.log(response.data);
  setDevices(response.data);
};

/**
 * Get a device with his identifier
 * @method getDevice
 * @param {String} serialNumber Identifier of a device
 * @param {Array} setDevice Array of a device
 */
export const getDevice = async (serialNumber_, setDevice) => {
  console.log("debug:" + serialNumber_);
  const response = await axios.post(`http://${IP_SERVER}:${PORT_BACKEND}/getDevice`, {
    serialNumber: serialNumber_,
  });
  console.log("debug:" + serialNumber_);
  setDevice(response.data);
  console.log(response.data);
};

/**
 * Delete a device
 * @method deleteDevice
 * @param {*} e Event
 */
export const deleteDevice = async (e) => {
  try {
    await axios.post(`http://${IP_SERVER}:${PORT_BACKEND}/deleteDevice`, {
      serialNumber: e.currentTarget.id,
    });
    window.location.reload();
  } catch (error) {
    if (error.response) {
      setMsg(error.response.data.msg);
    }
  }
};

/**
 * Modify a device 
 * @method modifyDevice
 * @param {*} e Event
 * @param {Integer} serialNumber Identifier of a device
 * @param {Bool} setValidated Validate data form
 * @param {Object} file File (.png, .jpeg, .jpg) 
 * @param {String} fileName Name of a file
 * @param {Bool} selected Bool to open modal window
 */
export const modifyDevice = async (
  e,
  serialNumber,
  setValidated,
) => {

  console.log("SN:" + serialNumber_);
 
  setValidated(true);

  e.preventDefault();

  try {
    await axios.post(`http://${IP_SERVER}:${PORT_BACKEND}/modifyDevice`, {
      serialNumber: serialNumber,
      location: location_.value,
      registered: registered.value,
      status: status_.value,
    });
    window.location.reload();
  } catch (error) {
    if (error.response) {
      setMsg(error.response.data.msg);
    }
  }
};

/**
 * Add a device
 * @method addDevice
 * @param {*} e Event
 * @param {Bool} setValidated Validate data form
 * @param {Object} file File (.png, .jpeg, .jpg) 
 * @param {String} fileName Name of a file
 * @param {Bool} selected Bool to open a model window
 */
export const addDevice = async (e, setValidated) => {
  const form = e.currentTarget;

  if (form.checkValidity() === false) {
    e.preventDefault();
    e.stopPropagation();
  }
  setValidated(true);
  e.preventDefault();

  try {
    await axios.post("http://172.20.10.2:9000/addDevice", {
      serialNumber: serialNumber.value,
      location: location_.value,
      registered: registered.value,
      status: status_.value,
    });
    window.location.reload();
  } catch (error) {
    if (error.response) {
      console.log("Error añadiendo un deviceo");
    }
  }
};