/**
 * @file Routes or endpoints
 */
import express from "express";
import { getUsers, Register, Login, Logout, modifyUser, deleteUser, toggleUserVerification, verifyUser, updateProfilePicture } from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { recoverPassword, resetPassword } from "../controllers/Mail.js";
import { getSections, getSection, addSection, modifySection, deleteSection } from "../controllers/Sections.js";
import { AddGame, getGamesBySectionId, EditGame, DeleteGame, getAllGamesWithSections} from "../controllers/Games.js";
import { createSessionGroup, uploadSessionData, getSessionStats, getSessionGraphAndStats, deleteSession } from "../controllers/Statistics.js"; // Asegúrate de tener la ruta correcta
import bodyParser from "body-parser";
import { getSensorValues, saveSensorValues } from "../controllers/Sensor.js";
 
const router = express.Router();

router.use(bodyParser.json({ limit: '50mb' }));
router.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// User
router.get('/users', verifyToken, getUsers);
router.post('/users/verify', toggleUserVerification);
router.post('/modifyUser', modifyUser);
router.post('/users', Register);
router.post('/deleteUser', deleteUser);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.get('/verify/:token', verifyUser);
router.post('/users/updateProfilePicture', updateProfilePicture);

// Sections
router.get('/sections/:userName', getSections);
router.get('/section/:id', getSection);
router.post('/section', addSection);
router.put('/section/modify', modifySection);
router.delete('/section/:id', deleteSection);

// Games
router.post('/addGame', AddGame);
router.get('/gamesSectionId', getGamesBySectionId);
router.put('/editGame', EditGame);
router.delete('/deleteGame', DeleteGame);
router.get('/games', getAllGamesWithSections);

// Mail
router.post('/recoverPassword', recoverPassword)
router.post('/resetPassword', resetPassword)

// Statistics
router.post("/sessions/groups", createSessionGroup);
router.post("/sessions/data", uploadSessionData);
router.get("/sessions/stats", getSessionStats);
router.get('/sessions/graph-stats/:sessionGroupId', getSessionGraphAndStats);
router.delete('/sessions/:sessionGroupId', deleteSession);

//Sensor
router.get('/sensor', getSensorValues);
router.post('/sensor', saveSensorValues);




export default router;