import { Sequelize } from "sequelize";
import db from "../config/AuthDB.js";

const { DataTypes } = Sequelize;

// Tabla para almacenar las estadísticas de cada grupo de sesión
const SessionStatistics = db.define('session_statistics', {
    sessionGroupId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'session_groups',
            key: 'id',
        },
        allowNull: false,
    },
    totalDuration: {
        type: DataTypes.FLOAT, // Suma total de la duración (en minutos)
        allowNull: false,
        defaultValue: 0,
    },
    avgDuration: {
        type: DataTypes.FLOAT, // Promedio de duración de cada partida (en minutos)
        allowNull: false,
        defaultValue: 0,
    },
    longestDuration: {
        type: DataTypes.FLOAT, // Duración de la partida más larga (en minutos)
        allowNull: false,
        defaultValue: 0,
    },
    shortestDuration: {
        type: DataTypes.FLOAT, // Duración de la partida más corta (en minutos)
        allowNull: false,
        defaultValue: 0,
    },
    avgTotalScore: {
        type: DataTypes.FLOAT, // Promedio de puntuación total
        allowNull: false,
        defaultValue: 0,
    },
    avgMaxScore: {
        type: DataTypes.FLOAT, // Promedio de puntuación máxima
        allowNull: false,
        defaultValue: 0,
    },
}, {
    freezeTableName: true,
    timestamps: true, // Para incluir `createdAt` y `updatedAt`
});

// Relación con la tabla `SessionGroups`
import { SessionGroups } from './SessionGroupsModel.js';

SessionGroups.hasOne(SessionStatistics, {
    foreignKey: 'sessionGroupId',
    onDelete: 'CASCADE', // Elimina estadísticas si se elimina el grupo
});
SessionStatistics.belongsTo(SessionGroups, {
    foreignKey: 'sessionGroupId',
});

// Sincronizar con la base de datos
(async () => {
    await db.sync();
})();

export default SessionStatistics;