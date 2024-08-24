/**
 * @file Data model for sections
 */
import { Sequelize } from "sequelize";
import db from "../config/AuthDB.js";
import Users from "./UserModel.js"; // Asegúrate de que la ruta sea correcta
 
const { DataTypes } = Sequelize;

const Sections = db.define('sections', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rows: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cols: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Users, // Hace referencia a la tabla Users
            key: 'userName'
        },
        onUpdate: 'CASCADE', // Opcional: actualiza automáticamente si el userName en Users cambia
        onDelete: 'CASCADE', // Opcional: elimina automáticamente las secciones si el usuario es eliminado
    }
}, {
    freezeTableName: true
});

// Sincronizar el modelo con la base de datos
(async () => {
    await db.sync();
})();

export default Sections;
