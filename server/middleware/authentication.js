
const jwt = require('jsonwebtoken');


//=========================================
// verificar token
//=========================================
let verificarToken = (req, res, next) => {
    //obtener token
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decode) => {

        //si el token no es válido
        if (err) {
            //no autorizado
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        }

        req.usuario = decode.usuario;
        //continua
        next();

    });

}

//=========================================
// verificar adminRol
//=========================================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'el usuario no es administrador'
            }
        })
    }

    next();


}


module.exports = {
    verificarToken,
    verificaAdmin_Role
}