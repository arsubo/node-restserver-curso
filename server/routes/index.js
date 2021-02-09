const express = require('express');

const app = express();

//usamos las rutas de los usuarios
app.use(require('./usuario'));
app.use(require('./login'));

module.exports = app;