const express = require('express');
require('dotenv/config');
const app = express();
const http = require('http');
const cli = require('nodemon/lib/cli');

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let clients = [] ;
let messages = [] ;

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
//client join
io.on('connection', (socket) => {
  // console.log('new connection');

  clients.push(socket.id)
  // console.log('added client '+socket.id+' to list');

  socket.join('room');
  
  socket.broadcast.emit('user_join',{
    online: clients.length,
    msg: socket.id+' joined',
  });
  
  io.to(socket.id).emit('load_messages',messages.slice(-15));
  
  // client left
  socket.on('disconnect', () =>{
    clients.splice(socket.id, 1);
    socket.broadcast.emit('user_left',{
      online: clients.length,
      msg: socket.id+' left',
    });
  });
  
  socket.on("hello", (arg) => {
    console.log(arg); // world
  });
  socket.on("send_message",(data)=>{
    messages.push(data)
    socket.broadcast.emit('sayForAll',data);
  });
  
  
});
const PORT = process.env.PORT | process.env.APP_PORT
server.listen(PORT, () => {
  console.info(`listening on *: ${PORT}`);
});
