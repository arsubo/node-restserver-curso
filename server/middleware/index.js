

const validaCampos = require('../middleware/validar-campos');
const validarJWT = require('../middleware/validar-jwt');
const validarRoles = require('../middleware/validar_roles');

module.exports = {
    ...validaCampos,
    ...validarJWT,
    ...validarRoles,
}