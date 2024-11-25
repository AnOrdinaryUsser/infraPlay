/**
 * Module for CRUD functions for users
 * @module UserService
 */
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
 * Delete a user
 * @method deleteUser
 * @param {Object} e Event
 */
export const deleteUser = async (userName) => {
  try {
    await axios.post(`http://${IP_SERVER}:${PORT_BACKEND}/deleteUser`, {
      userName: userName,
    });
    //window.location.reload();
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
  
  if (form.checkValidity() === false) {
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);
    return; 
  }

  e.preventDefault();
  
  try {
    let base64Data = null;
    if (typeof profilePicture === 'string') {
      base64Data = profilePicture.split(',')[1];
    } else {
      console.error('profilePicture no es una cadena');
    }

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
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    if (error.response) {
      //alert(error.response.data.msg); 
    } else {
      //alert("Ocurrió un error inesperado."); 
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

/**
 * Update the profile picture of a user
 * @method updateProfilePicture
 * @param {string} userId - ID of the user
 * @param {string} profilePicture - Base64 encoded image data
 * @returns {Object} Response message
 */
export const updateProfilePicture = async (userId, profilePicture) => {
  try {
    const base64Data = profilePicture.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    const user = await Users.findOne({ where: { id: userId } });
    if (!user) {
      return { success: false, msg: "User not found" };
    }

    user.profilePicture = buffer; // Update the profile picture in the database
    await user.save();

    return { success: true, msg: "Profile picture updated successfully" };
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return { success: false, msg: "Error updating profile picture" };
  }
};


