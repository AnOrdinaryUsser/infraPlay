import models from "../models/GamesSectionsModel.js"; // models ahora contiene { SessionGroups, SessionData }

const { Games, Sections } = models;

/**
 * Module to add a game
 * @module AddGame
 */
export const AddGame = async (req, res) => {
    const { gameName, gameUrl, sectionId, gameImage } = req.body;

    try {
        await Games.create({
            name: gameName,
            gameUrl: gameUrl,
            image: gameImage ? Buffer.from(gameImage, 'base64') : null, // Convertir base64 a Buffer
            sectionId: sectionId
        });
        res.json({ msg: "Game added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error adding game" });
    }
};

/**
 * Controlador para obtener juegos por ID de sección
 * @param {Object} req - La solicitud del cliente
 * @param {Object} res - La respuesta del servidor
 */
export const getGamesBySectionId = async (req, res) => {
    const { sectionId } = req.query; // Obtiene el ID de sección del cuerpo de la solicitud

    if (!sectionId) {
        return res.status(400).json({ msg: "Section ID is required" });
    }

    try {
        // Busca los juegos asociados con el sectionId
        const games = await Games.findAll({ where: { sectionId } });

        // Convierte el buffer de la imagen a base64 si es necesario
        const gamesWithBase64Images = games.map(game => {
            const gameData = game.toJSON(); // Convierte el juego a un objeto literal
            if (gameData.image && Buffer.isBuffer(gameData.image)) {
                gameData.image = gameData.image.toString('base64'); // Convierte el buffer a base64
            }
            return gameData;
        });

        res.json(gamesWithBase64Images); // Envía los juegos con las imágenes en base64
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error retrieving games" });
    }
};

/**
 * Module to edit a game
 * @module EditGame

export const EditGame = async (req, res) => {
    const { gameId, gameName, gameUrl, gameImage } = req.body;

    try {
        const game = await Games.findByPk(gameId);

        if (!game) {
            return res.status(404).json({ msg: "Game not found" });
        }

        // Actualiza los detalles del juego
        game.name = gameName || game.name;
        game.gameUrl = gameUrl || game.gameUrl;
        if (gameImage) {
            game.image = Buffer.from(gameImage, 'base64'); // Convertir base64 a Buffer
        }

        await game.save();

        res.json({ msg: "Game updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error editing game" });
    }
};
 */

export const EditGame = async (req, res) => {
    const { gameId, gameName, gameUrl, gameImage, sectionId } = req.body;
  
    try {
      const game = await Games.findByPk(gameId);
  
      if (!game) {
        return res.status(404).json({ msg: "Game not found" });
      }
  
      // Actualiza los detalles del juego
      game.name = gameName || game.name;
      game.gameUrl = gameUrl || game.gameUrl;
      if (gameImage) {
        game.image = Buffer.from(gameImage, 'base64'); // Convertir base64 a Buffer
      }
      if (sectionId) {
        game.sectionId = sectionId; // Actualiza el ID de la sección
      }
  
      await game.save();
  
      res.json({ msg: "Game updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error editing game" });
    }
  };   

/**
 * Module to delete a game
 * @module DeleteGame
 */
export const DeleteGame = async (req, res) => {
    const { gameId } = req.query;

    try {
        const game = await Games.findByPk(gameId);

        if (!game) {
            return res.status(404).json({ msg: "Game not found" });
        }

        await game.destroy();

        res.json({ msg: "Game deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error deleting game" });
    }
};

export const getAllGamesWithSections = async (req, res) => {
  const { userName } = req.query;
  console.log(userName);
  try {
    const games = await Games.findAll({
      include: [
        {
          model: Sections,
          attributes: ['name','userName'], // Solo queremos el nombre de la sección
          where: { userName },
        },
      ],
    });
    //console.log(games[0].section.name);

    // Transformar los datos para incluir el nombre de la sección directamente en cada juego
    /*const result = games.map(game => ({
      id: game.id,
      name: game.name,
      gameUrl: game.gameUrl,
      
      image: Buffer.from(game.image, 'base64'),
      sectionName: game.section?.name || null, // Manejar casos donde no haya sección
    }));*/

    const gamesWithBase64Images = games.map(game => {
      const gameData = game.toJSON(); // Convierte el juego a un objeto literal
      if (gameData.image && Buffer.isBuffer(gameData.image)) {
          gameData.image = gameData.image.toString('base64'); // Convierte el buffer a base64
      }
      if (gameData.section) {
        gameData.sectionName = gameData.section.name; // Asume que `section` tiene un campo `name`
      } else {
        gameData.sectionName = null; // Si no hay sección, asigna null
      }
      return gameData;
    });


    res.status(200).json(gamesWithBase64Images);
  } catch (error) {
    console.error('Error fetching games with sections:', error);
    res.status(500).json({ error: 'Error fetching games with sections' });
  }
};


