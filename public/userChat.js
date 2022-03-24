console.log('starting');
var socket = io();
var username = '';
socket.on('connect', () => {
    console.log('{connected}');
});
socket.on('connect_error',(e)=>{
    console.log(e.message)
});
socket.on('disconnect', () => {
    console.log('disconnected');
});
socket.on('join', (msg) =>{
    console.log('{join}');
    console.log(msg);
});
socket.on('user_join', (msg) =>{
    console.log('{user_join}');
    console.log(msg);
});
socket.on('user_left', (msg) =>{
    console.log('{user_left}');
    console.log(msg);
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
})
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
inputText.addEventListener('keyup' , function(event) {
    if (event.keyCode === 13){
        event.preventDefault();
        sendMessage();
    }
});

function showSendedMessage(message){
    let newElement = document.createElement('div');
    
    newElement.textContent = message.message;
    newElement.classList.add('chat-message','my-message');
    
    document.getElementById("demo").appendChild(newElement);
    scrollDown();
    
};
function showRecievedMessage(message){
    let newElement = document.createElement('div');
    newElement.textContent = message.user + ':\n'+ message.message;
    
    newElement.classList.add('chat-message','received-message');
    document.getElementById("demo").appendChild(newElement);
    scrollDown();
};

function scrollDown(){
    let demo = document.getElementById("demo");
    demo.scrollTo(0,demo.scrollHeight)
};