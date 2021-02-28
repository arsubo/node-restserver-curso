const { response, request } = require("express");
const { Categoria, Usuario } = require('../models')

//obtenerCategorias - paginado  - total - populate

const obtenerCategorias = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    });
}

const obtenerCategoria = async (req = request, res = response) => {
    const { id } = req.params;


    const existeCategoria = await Categoria.findById(id).populate('usuario', 'nombre');

    if (!existeCategoria) {
        throw new Error(`El id no existe ${id}`);
    } else if (existeCategoria.estado === false) {
        return res.status(404).json({
            ok: false,
            msg: 'Catagoria no existe'
        })
    }
    else {
        res.json({
            existeCategoria
        });
    }

}

//obtenerCategoria -  populate


const crearCategorias = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    try {
        const categoriaDB = await Categoria.findOne({ nombre });


        if (categoriaDB) {
            res.status(400).json({
                ok: false,
                msg: `La categoria ${categoriaDB.nombre} ya existe`
            })
        }


        const data = {
            nombre,
            usuario: req.usuario.uid
        }

        const categoria = new Categoria(data);

        await categoria.save();

        res.status(201).json({
            ok: true,
            categoria
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'error al grabar la categoria'
        })

        console.log(error)
    }
}

//actualizar categoria
const actualizarCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    //para extraer los datos que no quiero se pueda actualizar
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario.uid;

    try {
        const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
        res.json(categoria);
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: `Error al actualizar la categoría ${nombre} `
        })
    }

}

//borrar categorias : cambiar el estado a false
const BorrarCategoria = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const { nombre } = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });
        res.json({ ok: true, msg: `Categoría ${nombre} borrada con éxito` });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: `Error al borrar la categoría ${nombre} `
        })
    }

}

module.exports = {
    crearCategorias,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    BorrarCategoria
}