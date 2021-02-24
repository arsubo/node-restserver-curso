const { request } = require('express');


const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req = request, res = response) => {
    const { email, password } = req.body;

    try {

        //verificar si el email existe
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / Password no con correctos'
            });
        }

        //verificar constraseña
        const validarPassword = bcrypt.compareSync(password, usuario.password);
        if (!validarPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / Password no con correctos'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);


        res.json({
            ok: true,
            usuario,
            token
        })
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;


    try {
        const { email, nombre, img } = await googleVerify(id_token);

        //buscamos si el usuario ya existe
        let usuario = await Usuario.findOne({ email });


        if (!usuario) {
            //crearlo
            const data = {
                nombre,
                email,
                password: ':P',
                img,
                google: true
            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        //si el usuario está borrado
        if (!usuario.estado) {
            return res.status(401).json({
                ok: false,
                msg: 'hable con el administrador'
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        })

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'token de google no es valido'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}