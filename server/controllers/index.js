const auth = require('./auth');
const categorias = require('./categorias');
const productos = require('./productos');
const usuario = require('./usuario');
const buscar = require('./buscar');

module.exports = {
    ...auth,
    ...categorias,
    ...productos,
    ...usuario,
    ...buscar
}