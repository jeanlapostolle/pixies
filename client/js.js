var socket = io();
document.getElementById("button_pseudo_send").addEventListener("click", function(event){
  event.preventDefault()
  p = document.getElementById("p");
  socket.emit('change username', p.value);
  modal = document.getElementById("myModal")
  modal.style.display = "none";
  p.value = '';
});

document.getElementById("button_chat_send").addEventListener("click", function(event){
  event.preventDefault()
  m = document.getElementById("m");
  p = document.getElementById("p");
  socket.emit('chat message', m.value);
  m.value = '';
});

socket.on('chat message', function(data){
  chat_messages = document.getElementById("messages")
  //shouldScroll = chat_messages.scrollTop + chat_messages.clientHeight === chat_messages.scrollHeight;

  li = document.createElement('li')
  spanusr = document.createElement('span')
  spanmsg  = document.createElement('span')

  spanusr.textContent = data.user + " : "
  spanusr.className   = "usrchat"
  spanmsg.textContent = data.message
  spanmsg.className   = "msgchat"
  li.append(spanusr)
  li.append(spanmsg)
  chat_messages.append(li);

  chat = document.getElementsByClassName("chat")[0]
  chat.scrollTop = chat_messages.clientHeight;
});

socket.on('chat info', function(info){
  chat_messages = document.getElementById("messages")
  li = document.createElement('li')
  li.textContent = info
  chat_messages.append(li);
});

function scrollToBottom() {
  chat_messages = document.getElementById("messages")
  chat_messages.scrollTop = chat_messages.scrollHeight;
}

scrollToBottom();


var canvasArea = null,
    inputColor = null,
    inputSize = null,
    ctx = null,
    canvasWidth = 640,
    canvasHeight = 480,
    isDrawing = false,
    lineWidth = 3;


canvasArea = document.getElementById("canvas-area");
function initialize() {
    canvasArea.width = canvasWidth;
    canvasArea.height = canvasHeight;

    ctx = canvasArea.getContext("2d");

    // btnClear = document.querySelector("#clear");
    // btnSave = document.querySelector("#save");
    // inputColor = document.querySelector("#color");
    // inputSize = document.querySelector("#size");

    window.onmouseup = function () {
        isDrawing = false;
        ctx.beginPath();
    }

    canvasArea.onmousedown = function (e) {
        isDrawing = true;
    }

    canvasArea.onmousemove = function (e) {
        if (isDrawing) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.lineWidth = lineWidth * 2;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(e.offsetX, e.offsetY, lineWidth, 0, 2 * Math.PI, true);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
            socket.emit('drawing', {x: e.offsetX, y: e.offsetY});
        }
    }
}

initialize();

socket.on('drawing', function(data){
  ctx = canvasArea.getContext("2d");
  ctx.lineTo(data.x, data.y);
  ctx.lineWidth = lineWidth * 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(data.x, data.y, lineWidth, 0, 2 * Math.PI, true);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(data.x, data.y);
});
