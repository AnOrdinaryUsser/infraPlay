/**
 * @file Data model for users
 */
import { Sequelize } from "sequelize";
import db from "../config/AuthDB.js";
 
const { DataTypes } = Sequelize;


const Sensor = db.define('Sensor', {
    xmin: {
    type: DataTypes.FLOAT,
    allowNull: false,
    },
    xmax: {
    type: DataTypes.FLOAT,
    allowNull: false,
    },
    ymin: {
    type: DataTypes.FLOAT,
    allowNull: false,
    },
    ymax: {
    type: DataTypes.FLOAT,
    allowNull: false,
    },
}, {
    tableName: 'sensors',
    timestamps: false,  
});

(async () => {
    await db.sync();
})();
 
export default Sensor;


  