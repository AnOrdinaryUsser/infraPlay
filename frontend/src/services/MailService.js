/**
 * Module for sent emails with node mailer
 * @module MailService
 */
import axios from "axios";

const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;
const PORT_FRONTEND = process.env.REACT_APP_PORT_FRONTEND;

/**
 * Send an email with an URL to change password
 * @method forgotPassword
 * @param {*} e Event
 * @param {Bool} setValidated Validate data form
 */
export const forgotPassword = async (e, setValidated) => {
  const form = e.currentTarget;
  if (form.checkValidity() === false) {
    e.preventDefault();
    e.stopPropagation();
  }
  setValidated(true);

  try {
    await axios.post(`http://${IP_SERVER}:${PORT_BACKEND}/recoverPassword`, {
      email: email.value,
    });
    window.location.replace(`http://${IP_SERVER}:${PORT_FRONTEND}/SentEmail`);
  } catch (error) {
    if (error.response) {
      alert("🚨 Error al enviar el correo");
    }
  }
};

/**
 * Change user password (new password)
 * @method changePassword
 * @param {*} e Event
 * @param {String} token Identifier of an user
 * @param {Bool} setValidated Validate data form
 */
export const changePassword = async (e, token, setValidated) => {
  const form = e.currentTarget;
  if (form.checkValidity() === false) {
    e.preventDefault();
    e.stopPropagation();
  }
  setValidated(true);

  try {
    await axios.post(`http://${IP_SERVER}:${PORT_BACKEND}/resetPassword`, {
      token: token,
      pass: password.value,
    });
    window.location.replace("/");
  } catch (error) {
    if (error.response) {
      setMsg(error.response.data.msg);
    }
  }
};
