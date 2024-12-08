/**
 * @file Controller to handle frontend mail requests
 */
import nodemailer from 'nodemailer'
import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const IP_SERVER = process.env.IP_SERVER;
const PORT_BACKEND = process.env.PORT_BACKEND;
const PORT_FRONTEND = process.env.PORT_FRONTEND;
const PORT_PROXY = process.env.PORT_PROXY;


/**
 * Module to recover password
 * @module recoverPassword
 */
export const recoverPassword = async (req, res) => {
    const { token, email} = req.body;

    const user = await Users.findOne({
        where: {
            email: email,
        }
    })
    if (user === null) {
        console.log("User don't exit");
    } else {
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
        try {
            var mailOptions = {
                from: '"InfraPlay" <infraplay.not.reply@gmail.com>',
                to: email,
                subject: 'Solicitud de contraseña olvidada',
                text: 'Solicitud de contraseña',
                html: '<!doctype html><html lang="en-US"><head> <meta content="text/html; charset=utf-8" http-equiv="Content-Type" /> <title>Reset Password Email</title> <meta name="description" content="Reset Password Email"> <style type="text/css"> a:hover {text-decoration: underline !important;} </style></head><body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"><table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: "Open Sans", sans-serif;"> <tr> <td> <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"> <tr> <td style="height:80px;">&nbsp;</td></tr><tr><td style="text-align:center;"><img width="60" src="https://i.ibb.co/W3v6qcH/infra-Play.png"> </a> </td> </tr> <tr> <td style="height:20px;">&nbsp;</td></tr><tr><td><table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);"> <tr> <td style="height:40px;">&nbsp;</td> </tr> <tr> <td style="padding:0 35px;"> <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:"Rubik",sans-serif;">Hola ' + user.name + ', has solicitado restablecer tu contraseña</h1> <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span> <p style="color:#455056; font-size:15px;line-height:24px; margin:0;"> No hay problema, aquí puedes restablecerla. Para la próxima vez no te olvides de ella!<p></p><a href="http://' + IP_SERVER + ':' + PORT_FRONTEND + '/resetPassword?token=' + user.refresh_token + '">Contraseña</a></p></td></tr><tr><td style="height:40px;">&nbsp;</td></tr></table></td><tr><td style="height:20px;">&nbsp;</td></tr><tr><td style="text-align:center;"> <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>Aereal Vision</strong></p></td></tr><tr><td style="height:80px;">&nbsp;</td></tr></table></td></tr></table></body></html>'
            };
            
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
            });
            res.json({msg: "Mesage sent"});
        } catch (error) {
            console.log(error);
        }
    }

   
}

/**
 * Module to reset password
 * @module resetPassword
 */
export const resetPassword = async(req, res) => {
    const { token, pass } = req.body;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(pass, salt);

    const user = await Users.findOne({
        where:{
            refresh_token: token
        }
    });
    console.log(user)
    if (user === null ) {
        res.json({msg: "User dont exit"});
    } else {
        await Users.update({password: hashPassword},{
            where:{
                refresh_token: token
            }
        });
        res.json({msg: "Pasword UPDATE"});
    }
}