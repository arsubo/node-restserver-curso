
//==============================================
// Puerto
//==============================================

process.env.PORT = process.env.PORT || 3000;

//==============================================
// Entorno
//==============================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==============================================
// Vencimiento del token
//==============================================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//==============================================
// SEED de autenticación
//==============================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
//==============================================
// Base de datos
//==============================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    // urlDB = 'mongodb://localhost:27017/cafe';
    urlDB = 'mongodb+srv://cafe:trOk8ExEDaJ94ARe@cluster0.eyabv.mongodb.net/cafe';
} else {
    //producción
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;