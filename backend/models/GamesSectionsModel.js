/**
 * @file Data model for sections and games
 */
import { Sequelize } from "sequelize";
import db from "../config/AuthDB.js";

const { DataTypes } = Sequelize;

// Modelo de Secciones
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
    },
}, {
    freezeTableName: true,
});

// Modelo de Juegos
const Games = db.define('games', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.BLOB('long'), // Imagen en binario
        allowNull: true,
    },
    gameUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    freezeTableName: true,
});

// Establecer relaciones
Sections.hasMany(Games, {
    foreignKey: 'sectionId', // Clave foránea en games
    onDelete: 'CASCADE', // Elimina los juegos si se elimina la sección
});
Games.belongsTo(Sections, {
    foreignKey: 'sectionId',
});

// Sincronizar los modelos con la base de datos
(async () => {
    await db.sync(); // Usa `alter: true` para actualizar la estructura si ya existe.
})();

export default { Sections, Games };
