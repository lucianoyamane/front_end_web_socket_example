var stompClient = null;
var id_value = null;


function initRequestListener(id) {
    console.log(id);
    id_value = id;
    displayId();
    connect()
        .then(() => 
                stompSubscribe(`/queue/${id_value}`, (data) => {
                    let mensagem = data.body;
                    console.log("message received", id_value);
                    displayMessage(mensagem);
                })
            );
}

function stompSubscribe(endpoint, callback){ 
    stompClient.subscribe(endpoint, callback);
}

function select(str){
    return document.querySelector(str);
}

function displayId(){    
    select("#user-id-label").innerHTML = id_value;
}

function displayMessage(mensagem){    
    select("#user-message-label").innerHTML = mensagem;
}

function initRequest() {
    fetch('http://localhost:8600/register')
        .then((r) => r.json())
        .then((data) => initRequestListener(data))
        .catch((e) => console.log(e));
}

function connect(){ 
    return new Promise((resolve, reject) => {
      stompClient = Stomp.over(new SockJS('http://localhost:8600/websocket-app'))
      stompClient.connect({}, (frame) => resolve())
    })
}

function sendMessage(event) {

    const form = document.querySelector('#message-form');
    const elementInputMessage = form.elements['input-message'];

    if (elementInputMessage.value && stompClient) {
        
        var messageObj = {
            id : id_value,
            message : elementInputMessage.value
        };

        stompClient.send("/app/message", {}, JSON
                .stringify(messageObj));
        elementInputMessage.value = '';
    }
    event.preventDefault();
}

function initMessageForm() {
    select('#message-form').addEventListener('submit', sendMessage, true);
}

window.addEventListener('load', function(event){
    initRequest();
    initMessageForm();
});