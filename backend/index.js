import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import db from "./config/AuthDB.js";
import router from "./routes/index.js";
import Users from "./models/UserModel.js";
import Sections from "./models/SectionsModel.js";
import Games from "./models/GameModel.js";
import { Sequelize } from "sequelize";
import fs from 'fs';
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const { DataTypes } = Sequelize;
const DB_PASSWORD = process.env.DB_PASSWORD;
const IP_SERVER = process.env.IP_SERVER;
const PORT_FRONTEND = process.env.PORT_FRONTEND;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors({ credentials: true, origin: `http://${IP_SERVER}:${PORT_FRONTEND}` }));
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.use('/public', express.static('public'));

app.listen(9000, async () => {
  console.log('Server running at port 9000');

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(DB_PASSWORD, salt);

  try {
    await db.sync();

    const user = await Users.findByPk(1);

    const imageBuffer = fs.readFileSync('../frontend/src/assets/images/adminProfilePicture.jpg');

    if (!user) {
        await Users.create({
            name: 'Sergio',
            surname: 'García González',
            userName: 'admin',
            institute: 'Universidad de Salamanca',
            email: "sergio.gg@usal.es",
            password: hashPassword,
            role: "Admin",
            verified: true,
            profilePicture: imageBuffer,  // Almacenar el buffer de la imagen
        });
    }

    const sections = await Sections.findByPk(1);

    if (!sections) {
      await Sections.create({
        name: 'Juegos',
        rows: 1,
        cols: 2,
        userName: 'admin',
      });
    }

    const imageGame1 = fs.readFileSync('../frontend/src/assets/images/TicTacToe.png');
    const imageGame2 = fs.readFileSync('../frontend/src/assets/images/Diana.jpg');

    const games = await Games.findByPk(1);

    if (!games) {
      await Games.create({
        name: 'Tres en raya',
        gameUrl: '',
        image: imageGame1,
        sectionId: '1',
      });
      await Games.create({
        name: 'Diana',
        gameUrl: '',
        image: imageGame2,
        sectionId: '1',
      });
    }
    

  } catch (err) {
    console.error(err);
  }
});
