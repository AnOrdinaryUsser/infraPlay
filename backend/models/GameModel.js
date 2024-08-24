/**
 * @file Data model for games
 */
import { Sequelize } from "sequelize";
import db from "../config/AuthDB.js";
import Sections from "./SectionsModel.js"; // Asegúrate de que la ruta sea correcta

const { DataTypes } = Sequelize;

const Game = db.define('games', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.BLOB('long'), // Cambiado a BLOB para almacenar datos binarios
        allowNull: true,
    },
    gameUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Sections, // Hace referencia a la tabla Sections
            key: 'id'
        },
        onUpdate: 'CASCADE', // Actualiza automáticamente si el ID de la sección cambia
        onDelete: 'CASCADE', // Elimina el juego si la sección es eliminada
    }
}, {
    freezeTableName: true
});

// Sincronizar el modelo con la base de datos
(async () => {
    await db.sync();
})();

export default Game;
