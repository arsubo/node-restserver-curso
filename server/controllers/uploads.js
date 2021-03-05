const { response } = require('express');
const path = require('path');
const fs = require('fs');
const { subirArchivo, validarIDColeccion } = require('../helpers');
const cloudinary = require('cloudinary').v2

//configurar la cuenta
cloudinary.config(process.env.CLOUDINARY_URL)


const cargarArchivo = async (req, res = response) => {
    const { id, coleccion } = req.params;
    try {
        // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({
            nombre
        })
    } catch (msg) {
        res.status(400).json({
            ok: false,
            msg
        })
    }

}

const actualizarImagen = async (req, res = response) => {


    const { id, coleccion } = req.params;
    let modelo = await validarIDColeccion(coleccion, id);

    //limpiar imágenes previas
    if (modelo.img) {
        //hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImagen)) {
            //borra la imagen
            fs.unlinkSync(pathImagen);
        }

    }

    try {

        const nombre = await subirArchivo(req.files, undefined, coleccion);
        modelo.img = nombre;
        await modelo.save();
        res.json(modelo);
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: error
        })
    }

}


const actualizarImagenCloudinary = async (req, res = response) => {


    const { id, coleccion } = req.params;
    let modelo = await validarIDColeccion(coleccion, id);

    //limpiar imágenes previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');

        await cloudinary.uploader.destroy(public_id);
    }

    try {
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

        modelo.img = secure_url;
        await modelo.save();
        res.json(modelo);
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: error
        })
    }

}

const mostrarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo = await validarIDColeccion(coleccion, id);

    //limpiar imágenes previas
    if (modelo.img) {
        //hay que borrar la imagen del servidor
        //const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        const pathImagen = modelo.img;

        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen)
        }

    } else {

        const pathImagenNotFound = path.join(__dirname, '../assets', 'no-image.jpg');

        if (fs.existsSync(pathImagenNotFound)) {
            return res.sendFile(pathImagenNotFound)
        }

        return res.status(400).json({
            ok: false,
            msg: `No existe imagen de ${coleccion}`
        });
    }

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}