import { Sequelize } from "sequelize";
import db from "../config/AuthDB.js";
import Users from "./UserModel.js";
import Game from "./GamesSectionsModel.js"; // Importa el modelo de juegos

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
            model: Users,
            key: 'userName'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }
}, {
    freezeTableName: true
});

// Configurar asociaciones
Sections.associate = (models) => {
    Sections.hasMany(models.Game, {
        foreignKey: "sectionId",
        as: "Games", // Alias para las asociaciones
    });
};

// Sincronizar el modelo con la base de datos
(async () => {
    await db.sync();
})()