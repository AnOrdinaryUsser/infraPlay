/**
 * @file Data model for users
 */
import { Sequelize } from "sequelize";
import db from "../config/AuthDB.js";
 
const { DataTypes } = Sequelize;
 
const Users = db.define('users',{
    name:{
        type: DataTypes.STRING,
        unique: false
    },
    surname:{
        type: DataTypes.STRING,
        unique: false
    },
    userName:{
        type: DataTypes.STRING,
        unique: true
    },
    institute:{
        type: DataTypes.STRING,
        unique: false
    },
    email:{
        type: DataTypes.STRING,
        unique: true
    },
    password:{
        type: DataTypes.STRING,
        unique: true
    },
    refresh_token:{
        type: DataTypes.TEXT
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    verified:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    verificationToken: {
        type: DataTypes.STRING,
        allowNull: true,  
    },
    verificationExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    profilePicture: {  
        type: DataTypes.BLOB('long'),  
        allowNull: true,
    },
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
 
export default Users;