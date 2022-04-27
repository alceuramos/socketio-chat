const { Server } = require("socket.io");

var startServer = function (server) {

    const io = new Server(server);

    let clients = [];
    let messages = [];


    //client join
    io.on('connection', (socket) => {
        console.log('new connection');
        io.to(socket.id).emit('update_online_users', clients);



        // client left
        socket.on('disconnect', () => {
            for (item of clients) {
                if (item.id === socket.id) {
                    clients.splice(item, 1);
                    socket.broadcast.emit('user_left', {
                        clients: clients,
                        msg: socket.id + ' left',
                    });
                }
            }

        });
        socket.on('login', (username) => {
            clients.push({ id: socket.id, username: username });

            socket.join('room');
            socket.broadcast.emit('user_join', {
                clients: clients,
                msg: socket.id + ' joined',
            });

            io.to(socket.id).emit('join', { clients: clients });
        });

        socket.on('enter_username', () => {
            io.to(socket.id).emit('load_messages', messages.slice(-15));
        });
        socket.on("send_message", (data) => {
            messages.push(data)
            socket.broadcast.emit('sayForAll', data);
        });


    });
}
module.exports.startServer = startServer;