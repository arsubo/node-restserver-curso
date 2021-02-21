const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticón'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        req.uid = uid;

        //extraer información del usuario autenticado
        const usuario = await Usuario.findById(uid);


        //si el usuario no existe
        if (!usuario) {
            return res.status(401).json({
                ok: false,
                msg: 'Token no válido'
            })
        }

        //validar si el usuario no ha sido borrado
        if (!usuario.estado) {
            return res.status(401).json({
                ok: false,
                msg: 'Token no válido'
            })
        }

        req.usuario = usuario.toJSON();

        next();
    } catch (error) {
        return res.status(401).json({
            msg: 'No hay token en la peticón'
        });
    }

}

module.exports = {
    validarJWT
}