
const { Router } = require('express');
const { check } = require('express-validator');
const {
    crearCategorias,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    BorrarCategoria
} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers');

const { validarJWT, validarCampos, esAdminRole } = require('../middleware');

const router = Router();

/**
 * {{url}}/api/categorias
 */


//otener todas las categorias
router.get('/', obtenerCategorias)

//otener todas las categorias por id - publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
], obtenerCategoria)

//otener todas las categorias por id para cualquier rol válido
router.post('/', [
    validarJWT,
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    validarCampos],
    crearCategorias
)
//otener todas las categorias por id para cualquier rol válido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria)
//otener todas las categorias por id para rol admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], BorrarCategoria)



module.exports = router;