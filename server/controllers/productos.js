const { response, request } = require("express");
const { Producto } = require('../models')

//obtenerProducto - paginado  - total - populate

const obtenerProductos = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true, disponible: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });
}

const obtenerProducto = async (req = request, res = response) => {
    const { id } = req.params;


    const existeProducto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');

    if (!existeProducto) {
        throw new Error(`El id no existe ${id}`);
    } else if (existeProducto.estado === false) {
        return res.status(404).json({
            ok: false,
            msg: 'Producto no existe'
        })
    }
    else if (existeProducto.disponible === false) {
        return res.status(404).json({
            ok: false,
            msg: 'Producto no disponible'
        })
    }
    else {
        res.json({
            existeProducto
        });
    }

}

//obtenerProducto -  populate


const crearProducto = async (req = request, res = response) => {

    const { nombre: name, categoria, precio } = req.body;

    let nombre = name.toUpperCase();

    try {
        const productoDB = await Producto.findOne({ nombre });

        if (productoDB) {
            res.status(400).json({
                ok: false,
                msg: `El producto ${productoDB.nombre} ya existe`
            })
        }


        const data = {
            nombre,
            categoria,
            precio,
            usuario: req.usuario.uid
        }

        const producto = new Producto(data);

        await producto.save();

        res.status(201).json({
            ok: true,
            producto
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'error al grabar el producto'
        })

        console.log(error)
    }
}

//actualizar producto
const actualizarProducto = async (req = request, res = response) => {
    const { id } = req.params;
    //para extraer los datos que no quiero se pueda actualizar
    const { estado, usuario, categoria, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario.uid;

    try {
        const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
        res.json(producto);
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: `Error al actualizar el producto ${nombre} `
        })
    }

}

//borrar producto : cambiar el estado a false
const borrarProducto = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const { nombre } = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });
        res.json({ ok: true, msg: `Producto ${nombre} borrada con éxito` });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: `Error al borrar el producto ${nombre} `
        })
    }

}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto,
}