/**
 * @file Controller to handle frontend refresh of token requests
 */
import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { Buffer } from "buffer";

/**
 * Module to refresh a user session identifier
 * @module refreshToken
 */
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);
        
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken,
            },
        });
        if (!user[0]) return res.sendStatus(403);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);

            const userId = user[0].id;
            const name = user[0].name;
            const surname = user[0].surname;
            const userName = user[0].userName;
            const institute = user[0].institute;
            const role = user[0].role;
            const email = user[0].email;
            const profilePicture = user[0].profilePicture
                ? Buffer.from(user[0].profilePicture).toString('base64')  // Convertir a base64
                : null;
            console.log(profilePicture.slice(0, 50));
            const accessToken = jwt.sign(
                { userId, name, surname, userName, institute, email, role },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            res.json({ accessToken, user: { profilePicture } });  // Incluir profilePicture en la respuesta
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);  // Respuesta con error del servidor
    }
};
