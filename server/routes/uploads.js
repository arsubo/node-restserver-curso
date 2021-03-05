const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagenCloudinary, mostrarImagen } = require('../controllers');

const { validarCampos, validarJWT, validarArchivoSubir } = require('../middleware');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

router.post('/', [
    validarJWT,
    validarArchivoSubir,
    validarCampos
], cargarArchivo)


router.put('/:coleccion/:id', [
    validarJWT,
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary)

// actualizarImagen);


router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)

module.exports = router;