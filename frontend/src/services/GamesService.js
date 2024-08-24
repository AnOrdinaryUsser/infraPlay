import axios from "axios";

const IP_SERVER = process.env.REACT_APP_IP_SERVER;
const PORT_BACKEND = process.env.REACT_APP_PORT_BACKEND;

/**
 * Función para añadir un nuevo juego
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
 * Función para obtener juegos por ID de sección
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

/**
 * Función para editar un juego existente
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
 * Función para eliminar un juego
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
