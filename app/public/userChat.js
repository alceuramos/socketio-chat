console.log('starting');
var socket = io();
var username = '';
socket.on('connect', () => {
    console.log('{connected}');
    username = sessionStorage.getItem('username');
    if(username){
        socket.emit('login',username);
    }
});
socket.on('connect_error', (e) => {
    console.log(e.message)
});
socket.on('disconnect', () => {
    console.log('disconnected');
});
socket.on('join', (data) => {
    console.log('{join}');
    document.getElementById('username').style.display='none';
    document.getElementById('chat').style.display='block';
    updateOnline(data.clients);
});
socket.on('user_join', (data) => {
    console.log('{user_join}');
    updateOnline(data.clients);
});
socket.on('user_left', (data) => {
    console.log('{user_left}');
    updateOnline(data.clients);
});
socket.on('sayForAll', (data) => {
    showRecievedMessage(data);
});
socket.on('load_messages', (data) => {
    for (message of data) {
        if (message.user == username) {
            showSendedMessage(message);
        } else {
            showRecievedMessage(message);
        }
    }
});
socket.on('update_online_users',(clients)=>{
    updateOnline(clients);
});
let sendMessage = function () {
    let inputText = document.getElementById('text');
    let text = inputText.value;

    inputText.value = "";
    if (!text) {
        return;
    }


    let data = {
        'user': username,
        'message': text
    };

    showSendedMessage(data);
    socket.emit('send_message', data);
}
let inputText = document.getElementById('text');
inputText.focus();
inputText.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        sendMessage();
    }
});
let inputUsername = document.getElementById('username');
inputUsername.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        if (inputUsername) {
            username = inputUsername.value;
            document.getElementById('chat').style.display='block';
            socket.emit('enter_username');
            socket.emit('login',username);
            sessionStorage.setItem('username', username);
            inputUsername.parentElement.style.display='none';
        }
    }
});



function showSendedMessage(message) {
    let newElement = document.createElement('div');

    newElement.textContent = message.message;
    newElement.classList.add('chat-message', 'my-message');

    document.getElementById("messageArea").appendChild(newElement);
    scrollDown();

};
function showRecievedMessage(message) {
    let newElement = document.createElement('div');
    newElement.textContent = message.user + ':\n' + message.message;

    newElement.classList.add('chat-message', 'received-message');
    document.getElementById("messageArea").appendChild(newElement);
    scrollDown();
};

function scrollDown() {
    let messageArea = document.getElementById("messageArea");
    messageArea.scrollTo(0, messageArea.scrollHeight)
};
function updateOnline(clients) {
    let online = document.getElementById("online");
    // online.textContent = clients.length;
    let usersOnline = document.getElementById("users-online");
    usersOnline.innerHTML = '';
    let users = [];
    for (client of clients) {
        if (! users.includes(client.username)){
            users.push(client.username);
            let newClient = document.createElement('p');
            newClient.textContent = client.username;
            usersOnline.appendChild(newClient);
        }

    }
    online.textContent = users.length;
}