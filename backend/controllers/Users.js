/**
 * @file Controller to handle frontend tables requests
 */
import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { Op } from 'sequelize';
import dotenv from "dotenv";
dotenv.config();

const IP_SERVER = process.env.IP_SERVER;
const PORT_FRONTEND = process.env.PORT_FRONTEND;

/**
 * Module to get all users
 * @module getUsers
 */
export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
        });
        console.log(users);
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

// /**
//  * Module to register an user
//  * @module Register
//  */
// export const Register = async(req, res) => {
//     const { name, email, password, confPassword } = req.body;
//     if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
//     const salt = await bcrypt.genSalt();
//     const hashPassword = await bcrypt.hash(password, salt);
//     try {
//         await Users.create({
//             name: name,
//             email: email,
//             password: hashPassword,
//             role: "user"
//         });
//         res.json({msg: "Registration Successful"});
//     } catch (error) {
//         console.log(error);
//     }
// }

/**
 * Module to register a user
 * @module Register
 */
export const Register = async (req, res) => {
    const { name, surname, userName, institute, email, password, confPassword, profilePicture } = req.body;

    if (password !== confPassword) {
        return res.status(400).json({ msg: "Password and Confirm Password do not match" });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Generar un token de verificación
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token válido por 24 horas

    console.log("HOLA: ");
    console.log(profilePicture.slice(0, 50));

    try {
        const newUser = await Users.create({
            name: name,
            surname: surname,
            userName: userName,
            institute: institute,
            email: email,
            password: hashPassword,
            role: 'User',
            verified: 0,
            verificationToken: verificationToken,
            verificationExpires: verificationExpires,
            profilePicture: profilePicture ? Buffer.from(profilePicture, 'base64') : null,
        });

        // Enviar correo de verificación
        const verificationLink = `http://${req.headers.host}/verify/${verificationToken}`;
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // Servidor SMTP de Gmail
            port: 587, // Puerto para STARTTLS
            secure: false, // Cambia a true si prefieres SSL en lugar de STARTTLS
            auth: {
                user: process.env.EMAIL_USER, // Tu correo de Gmail
                pass: process.env.EMAIL_PASS, // Contraseña específica para aplicaciones
            },
            tls: {
                rejectUnauthorized: false, // Evita errores por certificados no confiables
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: newUser.email,
            subject: 'Verificación de la cuenta',
            html: '<!doctype html><html lang="en-US"><head> <meta content="text/html; charset=utf-8" http-equiv="Content-Type" /> <title>Reset Password Email</title> <meta name="description" content="Reset Password Email"> <style type="text/css"> a:hover {text-decoration: underline !important;} </style></head><body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"><table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: "Open Sans", sans-serif;"> <tr> <td> <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"> <tr> <td style="height:80px;">&nbsp;</td></tr><tr><td style="text-align:center;"><img width="200" src="https://i.ibb.co/W3v6qcH/infra-Play.png"> </a> </td> </tr> <tr> <td style="height:20px;">&nbsp;</td></tr><tr><td><table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);"> <tr> <td style="height:40px;">&nbsp;</td> </tr> <tr> <td style="padding:0 35px;"> <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:"Rubik",sans-serif;">Hola ' + newUser.name + ', gracias por registrarte.</h1> <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span> <p style="color:#455056; font-size:15px;line-height:24px; margin:0;"> Haga clic en el siguiente enlace para verificar su cuenta: <p></p><a href="' + verificationLink + '">Verificar cuenta</a></p><p></p>Este enlace caducará en 24 horas.</td></tr><tr><td style="height:40px;">&nbsp;</td></tr></table></td><tr><td style="height:20px;">&nbsp;</td></tr><tr><td style="text-align:center;"> <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>InfraPlay</strong></p></td></tr><tr><td style="height:80px;">&nbsp;</td></tr></table></td></tr></table></body></html>',
        };

        await transporter.sendMail(mailOptions);

        transporter.verify((error, success) => {
            if (error) {
                console.error("Error in email transporter configuration: ", error);
            } else {
                console.log("Email transporter is ready to send emails.");
            }
        });

        //res.json({ msg: "Registration successful, please check your email to verify your account" });
    } catch (error) {
        console.error(error);
        //res.status(500).json({ msg: "Error registering user" });
    }
};

export const verifyUser = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await Users.findOne({
            where: {
                verificationToken: token,
                verificationExpires: { [Op.gt]: new Date() }, // Verificar que el token no haya expirado
            },
        });

        if (!user) {
            //return res.status(400).json({ msg: "Invalid or expired verification token" });
            return res.redirect(`http://${IP_SERVER}:${PORT_FRONTEND}/TokenVerified`);
        }

        // Actualizar el usuario para que esté verificado
        user.verified = 1;
        user.verificationToken = null; // Opcional: Limpia el token después de verificar
        user.verificationExpires = null; // Opcional: Limpia la expiración
        await user.save();
        res.redirect(`http://${IP_SERVER}:${PORT_FRONTEND}/RegisterEmail`);
        res.json({ msg: "Account successfully verified" });
    } catch (error) {
        console.error(error);
        res.redirect(`http://${IP_SERVER}:${PORT_FRONTEND}/TokenVerified`);
        //res.status(500).json({ msg: "Error verifying user" });
    }
};

/**
 * Module to login an user
 * @module Login
 */
export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                userName: req.body.userName
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const userId = user[0].id;
        const userName = user[0].userName;
        const name = user[0].name;
        const surname = user[0].surname;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, userName, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        const refreshToken = jwt.sign({userId, userName, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
        console.log(accessToken)
    } catch (error) {
        res.status(404).json({msg:"User not found"});
    }
}

/**
 * Module to logout an user
 * @module Logout
 */
export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

/**
 * Module to modify data of an user
 * @module modifyUser
 */
export const modifyUser = async(req, res) => {
    const { name, surname, institute, email, password } = req.body;
    console.log(req.body)
    try {
        const user = await Users.findOne({
            where: {
                email: email,
            }
        })
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        console.log(user)
        user.name = name;
        user.surname = surname;
        user.institute = institute;
        user.email = email;
        user.password = hashPassword;
        user.save({fields: ['name', 'surname', 'institute', 'email', 'password']})
        /* await Users.update({
            name: name,
            email: email,
            password: hashPassword,
        }, {where: {refresh_token: refresh_token}}); */      
        await user.reload();         
        res.json({msg: "User modified"});
    } catch (error) {
        console.log(error);
    }
}

/**
 * Module to delete an user
 * @module deleteUser
 */
export const deleteUser = async(req, res) => {
    const { userName } = req.body;
    console.log(req.body);
    try {
        const user = await Users.destroy({
            where:{
                userName: userName
            }
        });
        res.json({msg: "User destroyed"});
    } catch (error) {
        console.log(error);
    }
}

/**
 * Alterna el estado de verificación de un usuario.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 */
export const toggleUserVerification = async (req, res) => {
    const { userName } = req.body; // Obtener el nombre de usuario del cuerpo de la solicitud
    
    console.log("USUARIO: " + userName);

    try {
        const user = await Users.findOne({ where: { userName: userName } });
      if (!user) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
      }
  
      user.verified = user.verified === 1 ? 0 : 1; // Alternar el estado de verificación
      await user.save();
      
      res.redirect('/registeredEmail');
      //res.status(200).json({ msg: 'Estado de verificación actualizado' });
    } catch (error) {
      console.error('Error al actualizar la verificación:', error);
      res.redirect('/tokenVerified');
      //res.status(500).json({ msg: 'Error al actualizar la verificación' });
    }
};

export const updateProfilePicture = async (req, res) => {
    const { userName, base64Data } = req.body;

    console.log(base64Data.slice(0, 50));

    if (!base64Data) {
        return res.status(400).json({ msg: "No image provided" });
    }

    try {

        const user = await Users.findOne({ where: { userName: userName } });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Guardamos la imagen en formato Base64
        user.profilePicture = base64Data ? Buffer.from(base64Data, 'base64') : null;
        console.log("Profile: ");
        console.log(user.profilePicture.slice(0, 50));
        user.save({fields: ['profilePicture']})
        await user.reload();   

        res.json({ msg: "Profile picture updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error updating profile picture" });
    }
};

  
  
  
