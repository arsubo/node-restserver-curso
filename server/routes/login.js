const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

//importamos el modelo
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');


app.post('/login', (req, res) => {

    let body = req.body;

    //validamos si el usuario existe
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //si el usuario no existe
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        //evaluamos la contrasña
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        //genera el token
        let token = jwt.sign({
            usuario: usuarioDB
        }, 'este-es-el-seed-desarrollo',
            {
                expiresIn: process.env.CADUCIDAD_TOKEN
            }
        )

        //retorna el usuario
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });


})

module.exports = app;