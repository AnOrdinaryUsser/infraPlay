/**
 * Module for CRUD functions for sections
 * @module SectionService
 */
import axios from "axios";

const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;

/**
 * Add a new section
 * @method addSection
 * @param {Object} section Data of the section to add
 * @param {Function} setValidated Function to update the validation state
 */
export const addSection = async (section) => {
  try {
    console.log(section);
    await axios.post(`http://${IP_SERVER}:${PORT_BACKEND}/section`, section);
    //window.location.reload(); // Refresh the page to see the new section
  } catch (error) {
    console.error("Error adding section:", error);
  }
};

/**
 * Delete a section
 * @method deleteSection
 * @param {Number} id ID of the section to delete
 */
export const deleteSection = async (id) => {
  try {
    await axios.delete(`http://${IP_SERVER}:${PORT_BACKEND}/section/${id}`);
    window.location.reload(); // Refresh the page to see the changes
  } catch (error) {
    console.error("Error deleting section:", error);
  }
};

/**
 * Modify an existing section
 * @method modifySection
 * @param {Object} section Data of the section to modify
 * @param {Function} setValidated Function to update the validation state
 */
export const modifySection = async (section, setValidated) => {
  try {
    setValidated(true); // Trigger form validation
    await axios.put(`http://${IP_SERVER}:${PORT_BACKEND}/section/modify`, section);
    window.location.reload(); // Refresh the page to see the updated section
  } catch (error) {
    console.error("Error modifying section:", error);
  }
};

/**
 * Get a specific section
 * @method getSection
 * @param {Number} id ID of the section
 * @param {Function} setSection Function to update the section state
 */
export const getSection = async (id, setSection) => {
  try {
    const response = await axios.get(`http://${IP_SERVER}:${PORT_BACKEND}/section/${id}`);
    console.log(response.data);
    setSection(response.data);
  } catch (error) {
    console.error("Error fetching section:", error);
  }
};

/**
 * Get all sections for a specific user
 * @method getSections
 * @param {String} userName Name of the user
 * @param {Function} setSections Function to update the sections state
 */
export const getSections = async (userName, setSections) => {
  try {
    const response = await axios.get(`http://${IP_SERVER}:${PORT_BACKEND}/sections/${userName}`);
    console.log(response.data);
    setSections(response.data);
  } catch (error) {
    console.error("Error fetching sections:", error);
  }
};




