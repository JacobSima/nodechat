import express from "express";
import http from "http";
import {json} from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import router from "./router";
import dbConnect from './db/dbConnect';
import { WebSocketServer, WebSocket} from "ws";
import { resolve }  from 'path';

const app = express();

app.use(cors({credentials: true,}))
app.use(express.static(resolve(__dirname, './public')));
app.use(compression());
app.use(cookieParser());
app.use(json())

app.use('/', router());

const server =  http.createServer(app);

const PORT = 8000; 
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

dbConnect();

const onSocketPreError = (e: Error) => {
  console.log("Pre Socket Error: ", e)
}
const onSocketPostError = (e: Error) => {
  console.log("Post Socket Error: ", e)
}

const wss = new WebSocketServer({noServer: true});
server.on('upgrade', (req, socket, head) => {

  socket.on('error', onSocketPreError);  // http handling error

  // Perfom Auth
  // if(true){
  //   socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
  //   socket.destroy();
  //   return;
  // }
  //console.log('Socket request: ', req);
  //console.log('Socket : ', socket);
  //console.log('Socket head: ', head);

  // Upgrade web socket, after doing Auth
  wss.handleUpgrade(req, socket, head, (ws) => {
    socket.removeListener('error', onSocketPreError);
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', (ws, req) => {
  console.log('ws connection closed established...');
  ws.on('error', onSocketPostError);  // websocket handling error

  ws.on('message', (msg, isBinary) => {
    wss.clients.forEach(client => {
      if(ws !== client && client.readyState === WebSocket.OPEN){
        client.send(msg, {binary: isBinary});
      }
    })
  })

  ws.on('close', () => {
    console.log('connection closed');
  })
})
