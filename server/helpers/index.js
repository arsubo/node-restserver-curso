
const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVarify = require('./google-verify');

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVarify,
}