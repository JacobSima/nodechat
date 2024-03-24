(function () {
  let ws;
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
          });

          ws.addEventListener('message', function (event) {
              showMessage(`Received message: ${event.data}`);
          });
      });
  }

  if (wsClose) {
      wsClose.addEventListener('click', closeConnection);
  }

  if (wsSend) {
      wsSend.addEventListener('click', function () {
          const val = wsInput.value;

          if (!val) {
              return;
          } else if (!ws) {
              showMessage('No WebSocket connection');
              return;
          }

          ws.send(val);
          showMessage(`Sent "${val}"`);
          wsInput.value = '';
      });
  }
})();
