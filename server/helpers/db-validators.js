const { Role, Usuario, Categoria, Producto } = require('../models');

const esRoleValido = async (rol = '') => {


    const existeRol = await Role.findOne({ rol });

    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

const emailExiste = async (email = '') => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
        throw new Error(`El correo: ${email}, ya está registrado`);
    }
}

const existeUsuarioPorId = async (id) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe ${id}`);
    }
}

const existeCategoriaPorId = async (id) => {

    // Verificar si el correo existe
    const existeCategoria = await Categoria.findById(id);

    if (!existeCategoria) {
        throw new Error(`El id de categoria no existe ${id}`);
    }
}

const existeProductoPorId = async (id) => {

    // Verificar si el correo existe
    const existeProducto = await Producto.findById(id);

    if (!existeProducto) {
        throw new Error(`El producto ${id} no existe`);
    }
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}
