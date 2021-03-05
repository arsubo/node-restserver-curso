
const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVarify = require('./google-verify');
const subirArchivo = require('./subir-archivo')

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVarify,
    ...subirArchivo
}