
const { Router } = require('express');
const { check } = require('express-validator');
const {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto,
} = require('../controllers');

const { existeProductoPorId, existeCategoriaPorId } = require('../helpers');


const { validarJWT, validarCampos, esAdminRole } = require('../middleware');

const router = Router();

/**
 * {{url}}/api/productos
 */


//otener todas las Productos
router.get('/', obtenerProductos)

//otener todas las categorias por id - publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], obtenerProducto)

//otener todas las categorias por id para cualquier rol válido
router.post('/', [
    validarJWT,
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    check('categoria', 'Categoria no es válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos],
    crearProducto
)
//otener todas las categorias por id para cualquier rol válido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto)
//otener todas las categorias por id para rol admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto)



module.exports = router;