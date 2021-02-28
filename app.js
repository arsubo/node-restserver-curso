require('dotenv').config();
const { Server } = require('./server/models');


const server = new Server();


server.listen();