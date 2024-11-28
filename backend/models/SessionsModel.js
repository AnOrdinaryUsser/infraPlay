/**
 * @file Data model for grouped sessions
 */
import { Sequelize } from "sequelize";
import db from "../config/AuthDB.js";

const { DataTypes } = Sequelize;

// Tabla de grupos de sesión con nombres únicos
const SessionGroups = db.define('session_groups', {
    sessionName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Garantiza que el nombre de sesión sea único
    },
}, {
    freezeTableName: true
});

// Tabla de datos de sesión, vinculada a grupos de sesión
const SessionData = db.define('session_data', {
    startTime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    totalScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    maxScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    freezeTableName: true
});

// Establecer la relación
SessionGroups.hasMany(SessionData, {
    foreignKey: 'sessionGroupId', // Clave foránea en session_data
    onDelete: 'CASCADE', // Elimina los datos si se elimina el grupo
});
SessionData.belongsTo(SessionGroups, {
    foreignKey: 'sessionGroupId',
});

// Sincronizar los modelos con la base de datos
(async () => {
    await db.sync();
})();

export default { SessionGroups, SessionData };