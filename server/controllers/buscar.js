const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async (termino = '', res = response) => {
    //validamos si es un mongoId
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }


    //expresión regular para que sea insensible a mayúsculas y minúsculas
    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { email: regex }],
        $and: [{ estado: true }]
    });

    const conteo = await Usuario.countDocuments({
        $or: [{ nombre: regex }, { email: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: { usuarios, conteo }
    });
}

const buscarCategorias = async (termino = '', res = response) => {
    //validamos si es un mongoId
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }


    //expresión regular para que sea insensible a mayúsculas y minúsculas
    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({ nombre: regex, estado: true });

    const conteo = await Categoria.countDocuments({ nombre: regex, estado: true });

    res.json({
        results: { categorias, conteo }
    });
}
const buscarProductos = async (termino = '', res = response) => {
    //validamos si es un mongoId
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    //expresión regular para que sea insensible a mayúsculas y minúsculas
    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({ nombre: regex, estado: true })
        .populate('categoria', 'nombre');

    const conteo = await Producto.countDocuments({ nombre: regex, estado: true });

    res.json({
        results: { productos, conteo }
    });
}


const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;


    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            ok: false,
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }


    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;

        default:
            res.status(500).json({
                ok: false,
                msg: 'No se puede hacer esta búsqueda'
            })
    }

}




module.exports = {
    buscar
}