/**
 * Module for CRUD functions for games
 * @module GameService
 */
import axios from "axios";

const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;

/**
 * Function to add a game in system
 * @method addGame
 * @param {String} gameName String to give a name for a game
 * @param {String} gameUrl String for URL of the embed game HP5
 * @param {String} gameImg Base64 encoded image data
 * @param {Number} sectionId Integer for identify a section
 */
export const addGame = async (gameName, gameUrl, gameImage, sectionId) => {
    try {
        let base64Data = null;
        if (typeof gameImage === 'string') {
            base64Data = gameImage.split(',')[1];
        } else {
            console.error('gameImage no es una cadena');
        }
        
        const response = await axios.post(`http://${IP_SERVER}:${PORT_BACKEND}/addGame`, {
            gameName: gameName,
            gameUrl: gameUrl,
            sectionId: sectionId,
            gameImage: base64Data,
        });

        return response.data;
    } catch (error) {
        console.error("Error adding game:", error);
        throw error;
    }
};

/**
 * Function to delete a game by gameId
 * @method getGamesBySectionId
 * @param {Number} gameId Integer for identify a game
 */
export const deleteGame = async (gameId) => {
    try {
        const response = await axios.delete(`http://${IP_SERVER}:${PORT_BACKEND}/deleteGame`, {
            params: { gameId }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting game:", error);
        throw error;
    }
};

/**
 * Function to edit a game in system
 * @method addGame
 * @param {String} gameName String to give a name for a game
 * @param {String} gameUrl String for URL of the embed game HP5
 * @param {String} gameImg Base64 encoded image data
 * @param {Number} sectionId Integer for identify a section
 */
export const editGame = async (gameId, gameName, gameUrl, gameImage) => {
    try {
        let base64Data = null;
        if (typeof gameImage === 'string') {
            base64Data = gameImage.split(',')[1];
        } else {
            console.error('gameImage no es una cadena');
        }
        
        const response = await axios.put(`http://${IP_SERVER}:${PORT_BACKEND}/editGame`, {
            gameId: gameId,
            gameName: gameName,
            gameUrl: gameUrl,
            gameImage: base64Data,
        });

        return response.data;
    } catch (error) {
        console.error("Error editing game:", error);
        throw error;
    }
};


/**
 * Function to get all games of section by id
 * @method getGamesBySectionId
 * @param {Number} sectionId Integer for identify a section
 */
export const getGamesBySectionId = async (sectionId) => {
    try {
        const response = await axios.get(`http://${IP_SERVER}:${PORT_BACKEND}/games`, {
            params: { sectionId }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener los juegos:", error);
        throw error;
    }
};



