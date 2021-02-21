const { response } = require('express');


const esAdminRole = (req, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            ok: false,
            msg: 'Se requiere verificar el rol sin validar el token primero'
        });
    }

    const { role, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROL') {
        return res.status(401).json({
            ok: false,
            msg: `${nombre} no es administrador`
        })
    }

    next();
}

const tieneRole = (...roles) => {

    return (req, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                ok: false,
                msg: 'Se requiere verificar el rol sin validar el token primero'
            });
        }

        console.log(req.usuario.rol)

        //validamos si no incluye el rol permitido
        if (!roles.includes(req.usuario.role)) {
            return res.status(401).json({
                ok: false,
                msg: `El servicio requiere uno de esto roles ${roles}`
            })
        }

        next();
    }

}


module.exports = { esAdminRole, tieneRole }