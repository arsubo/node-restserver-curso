require('./config/config');
const express = require('express')
const app = express();
// Using Node.js `require()`
const mongoose = require('mongoose');

const port = process.env.PORT;
const bodyParser = require('body-parser')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//usamos las rutas de los usuarios
app.use(require('./routes/usuario'));


//conectando a la bd
mongoose.connect(process.env.URLDB,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) throw err;

        console.log('Base datos ONLINE')
    })

app.listen(port, () => {
    console.log(`Escuchando el puerto ${port} `)
})