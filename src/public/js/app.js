(function () {
  let ws;
  const HEARTBEAT_TIMEOUT = (1000 * 5) + (1000 * 1); 
  const HEARTBEAT_VALUE = "1";
  const PONG_DATA = {
    isBinary: true,
    value: HEARTBEAT_VALUE
  }

  const messages = document.getElementById('messages');
  const wsOpen = document.getElementById('ws-open');
  const wsClose = document.getElementById('ws-close');
  const wsSend = document.getElementById('ws-send');
  const wsInput = document.getElementById('ws-input');

  function showMessage(message) {
      if (!messages) {
          return;
      }

      messages.textContent += `\n${message}`;
      messages.scrollTop = messages.scrollHeight;
  }

  function closeConnection() {
      if (ws) {
          ws.close();
      }
  }

  function heartbeat(data) {
    if(!ws) return ;
    ws.send(JSON.stringify(data))
  }

  if (wsOpen) {
      wsOpen.addEventListener('click', function () {
          closeConnection();

          ws = new WebSocket('ws://localhost:8000/');

          ws.addEventListener('error', function () {
              showMessage('WebSocket error');
          });

          ws.addEventListener('open', function () {
              showMessage('WebSocket connection established');
          });

          ws.addEventListener('close', function () {
              showMessage('WebSocket connection closed');
              if(!!ws.pingTimeOut){
                clearTimeout(ws.pingTimeOut);
              }
          });

          ws.addEventListener('message', function (msgEvent) {
            const msgData = JSON.parse(msgEvent.data);
            if(msgData.isBinary && msgData.value === PONG_DATA.value){
              heartbeat(msgData);
            } else {
              showMessage(`Received message: ${msgData.data}`);
            }
          });
      });
  }

  if (wsClose) {
      wsClose.addEventListener('click', closeConnection);
  }

  if (wsSend) {
      wsSend.addEventListener('click', function () {
          const val = wsInput.value;
          const data = JSON.stringify({isBinary: false, value: HEARTBEAT_VALUE, data: val})

          if (!val) {
              return;
          } else if (!ws) {
              showMessage('No WebSocket connection');
              return;
          }

          ws.send(data);
          showMessage(`Sent "${val}"`);
          wsInput.value = '';
      });
  }
})();
