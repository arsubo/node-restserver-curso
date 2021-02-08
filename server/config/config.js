
//==============================================
// Puerto
//==============================================

process.env.PORT = process.env.PORT || 3000;

//==============================================
// Entorno
//==============================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==============================================
// Base de datos
//==============================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb+srv://cafe:trOk8ExEDaJ94ARe@cluster0.eyabv.mongodb.net/cafe';
} else {
    //producción
    urlDB = 'mongodb+srv://cafe:trOk8ExEDaJ94ARe@cluster0.eyabv.mongodb.net/cafe';
}

process.env.URLDB = urlDB;