import axios from "axios";
import jwt_decode from "jwt-decode";

const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;

/**
 * Refresh identifier of a user
 * @method refreshToken
 * @param {Function} setToken Session identifier of a user
 * @param {Function} setExpire Time to expire an identifier
 * @param {Function} setName Name of the user
 * @param {Function} setSurname Surname of the user
 * @param {Function} setInstitute Institute of the user
 * @param {Function} setUserName Username
 * @param {Function} setEmail Email of the user
 * @param {Function} setProfilePicture Function to set the profile picture
 */
export const refreshToken = async (
  setToken,
  setExpire,
  setName,
  setSurname,
  setInstitute,
  setUserName,
  setEmail,
  setProfilePicture
) => {
  try {
    const response = await axios.get(`http://${IP_SERVER}:${PORT_BACKEND}/token`);
    setToken(response.data.accessToken);

    const decoded = jwt_decode(response.data.accessToken);
    setName(decoded.name);
    setSurname(decoded.surname);
    setInstitute(decoded.institute);
    setUserName(decoded.userName);
    setEmail(decoded.email);
    setExpire(decoded.exp);

    console.log(response.data);
    // Set the profile picture if available
    if (response.data.user && response.data.user.profilePicture) {
      setProfilePicture(`data:image/jpeg;base64,${response.data.user.profilePicture}`);
      console.log(response.data.user.profilePicture);
    }

  } catch (error) {
    if (error.response) {
      window.location.replace("/");
    }
  }
};

/**
 * Get all users in the system
 * @method getUsers
 * @param {Function} setUsers Array of all users
 * @param {String} token Session identifier of a user
 * @param {Object} axiosJWT Axios instance with token
 */
export const getUsers = async (setUsers, token, axiosJWT) => {
  const response = await axiosJWT.get(`http://${IP_SERVER}:${PORT_BACKEND}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  setUsers(response.data);
};

/**
 * Delete a user
 * @method deleteUser
 * @param {Object} e Event
 */
export const deleteUser = async (e) => {
  try {
    await axios.post(`http://${IP_SERVER}:${PORT_BACKEND}/deleteUser`, {
      userName: e.currentTarget.id,
    });
    //window.location.reload();
  } catch (error) {
    if (error.response) {
      alert(error.response.data.msg);
    }
  }
};

/**
 * Add a new user
 * @method addUser
 * @param {Object} e Event
 * @param {Function} setValidated Validate data form
 */
export const addUser = async (e, setValidated) => {
  const form = e.currentTarget;
  if (form.checkValidity() === false) {
    e.preventDefault();
    e.stopPropagation();
  }
  setValidated(true);

  e.preventDefault();
  try {
    await axios.post(`http://${IP_SERVER}:${PORT_BACKEND}/users`, {
      name: user.value,
      email: email.value,
      password: pass.value,
      confPassword: repeatPass.value,
    });
    window.location.reload();
  } catch (error) {
    if (error.response) {
      alert(error.response.data.msg);
    }
  }
};

/**
 * Modify attributes of a user
 * @method modifyUser
 * @param {Object} e Event
 * @param {String} name Username
 * @param {Function} setValidated Validate data form
 */
export const modifyUser = async (e, setValidated) => {
  const form = e.currentTarget;

  if (form.checkValidity() === false) {
    e.preventDefault();
    e.stopPropagation();
  }
  setValidated(true);
  e.preventDefault();

  try {
    await axios.post(`http://${IP_SERVER}:${PORT_BACKEND}/modifyUser`, {
      name: nameInput.value,
      surname: surname.value,
      institute: institute.value,
      email: emailInput.value,
      password: pass.value,
    });
    window.location.reload();
  } catch (error) {
    if (error.response) {
      alert(error.response.data.msg);
    }
  }
};

/**
 * Log in to the system
 * @method Auth
 * @param {Object} e Event
 * @param {Function} setValidated Validate data form
 * @param {Function} setProfilePicture Function to set the profile picture
 */
export const Auth = async (e, setValidated, setProfilePicture) => {
  const form = e.currentTarget;
  if (form.checkValidity() === false) {
    e.preventDefault();
    e.stopPropagation();
  }
  setValidated(true);

  const { userName, password } = e.target.elements;
  e.preventDefault();

  try {
    const response = await axios.post(`http://${IP_SERVER}:${PORT_BACKEND}/login`, {
      userName: userName.value,
      password: password.value,
    });
    console.log(response.data);
    // If the login is successful, store the profile picture if available
    if (response.data.user && response.data.user.profilePicture) {
      setProfilePicture(`data:image/jpeg;base64,${response.data.user.profilePicture}`);
    }

    window.location.replace("/dashboard");
  } catch (error) {
    if (error.response) {
      alert(error.response.data.msg);
    }
  }
};

/**
 * Register a new user
 * @method Register
 * @param {Object} e Event
 * @param {Function} setValidated Validate data form
 * @param {string} profilePicture Base64 encoded image data
 */
export const Register = async (e, setValidated, profilePicture) => {
  const form = e.currentTarget;
  
  // Previene el envío del formulario si no es válido
  if (form.checkValidity() === false) {
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);
    return; // Detiene la ejecución si el formulario no es válido
  }

  // Previene el comportamiento por defecto del formulario
  e.preventDefault();
  
  try {
    // Verifica que profilePicture sea una cadena
    let base64Data = null;
    if (typeof profilePicture === 'string') {
      // Extrae los datos base64, sin el prefijo de tipo MIME
      base64Data = profilePicture.split(',')[1];
    } else {
      console.error('profilePicture no es una cadena');
      // Opcional: Puedes establecer un valor predeterminado o manejar el error aquí
    }

    // Realiza la solicitud POST al backend
    const response = await axios.post(`http://${IP_SERVER}:${PORT_BACKEND}/users`, {
      name: form.name.value,
      surname: form.surname.value,
      userName: form.userName.value,
      email: form.email.value,
      institute: form.institute.value,
      password: form.pass.value,
      confPassword: form.repeatPass.value,
      profilePicture: base64Data,
    });

    console.log("Registro exitoso:", response.data);
    //window.location.replace("/"); // Redirige después del registro exitoso
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    if (error.response) {
      alert(error.response.data.msg); // Muestra mensaje de error del backend
    } else {
      alert("Ocurrió un error inesperado."); // Mensaje para errores no relacionados con la red
    }
  }
};

export const toggleUserVerification = async (userName, token) => {
  try {
    await axios.post(`http://${IP_SERVER}:${PORT_BACKEND}/users/verify`, 
      { userName }, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  } catch (error) {
    console.error("Error al actualizar la verificación del usuario:", error);
    throw error;
  }
};


