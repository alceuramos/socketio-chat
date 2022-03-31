const express = require('express');
require('dotenv/config');
const app = express();
const http = require('http');
const cli = require('nodemon/lib/cli');
const startServer = require('./serverChat')

const server = http.createServer(app);
startServer.startServer(server);  
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT | process.env.APP_PORT
server.listen(PORT, () => {
  console.info(`listening on *: ${PORT}`);
});
