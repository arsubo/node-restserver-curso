const { request } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');



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

module.exports = {
    login
}