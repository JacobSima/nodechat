import { getUserBySessionToken } from "../db/users";
import { Server } from "http";
import { ExtWebSocket } from "typings/ws";
import { WebSocketServer, WebSocket } from "ws";
import { Request } from 'express';
import { get } from 'lodash';
import { Message } from "typings/ms";
import { addMessage } from "../db/chats";

const onSocketPreError = (e: Error) => {
  console.log("Pre Socket Error: ", e);
};

const onSocketPostError = (e: Error) => {
  console.log("Post Socket Error: ", e);
};

const HEARTBEAT_INTERVAL = 1000 * 5; // 5 seconds
const HEARTBEAT_VALUE = "1";
const data = {
  isBinary: true,
  value: HEARTBEAT_VALUE
}

const ping = (ws: ExtWebSocket) => {
  ws.send(JSON.stringify(data));
};

const getCookie = (req: any) => {
  const serverRequest = req as Request;
  const url =  new URL(serverRequest.url, `ws://${serverRequest.headers.host}`);
  const at = url.searchParams.get('at') ?? '';
  return at;
}

const getUserId = (req: any) => {
  const serverRequest = req as Request;
  const currentUserId = get(serverRequest, 'identity._id');
  return currentUserId;
}

const configureSocket = (s: Server) => {
  const wss = new WebSocketServer({ noServer: true });
  s.on("upgrade", async (req, socket, head) => {
    socket.on("error", onSocketPreError); // http handling error

    // Perfom Auth
    const at = getCookie(req);
    if(!at || at === ''){
      socket.destroy();
      return;
    }
    const existingUser =  await getUserBySessionToken(at);

    if(!existingUser){
      socket.write('HTTP/1.1 401 Unaothorised')
      socket.destroy();
      return;
    }

    // Upgrade web socket, after doing Auth
    wss.handleUpgrade(req, socket, head, (ws) => {
      socket.removeListener("error", onSocketPreError);
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", async (ws: ExtWebSocket, req) => {
    ws.isAlive = true;
    const at = getCookie(req);
    const currentUserId =  await getUserBySessionToken(at);

    ws.on("error", onSocketPostError);

    ws.on("message", async(msg) => {
      const { isBinary, value, data } = JSON.parse(msg.toString());
      if(isBinary && value === HEARTBEAT_VALUE){
        ws.isAlive = true;
      } else {
        const message: Message = { sender: currentUserId!.id, content: data };
        await addMessage(message);

        wss.clients.forEach((client) => {
          // if (ws !== client && client.readyState === WebSocket.OPEN) {  // Do not send the message to the sender
          if (client.readyState === WebSocket.OPEN) {  // Send message to everyone in the channel
            // Message sent
            client.send(data, { binary: false });
          }
        });
      }
    });

    ws.on("close", () => {
      console.log("connection closed");
    });
  });

  // Logic for ping/pong check between sever and client
  // To avoid long polling for no-existing client connection
  const interval = setInterval(() => {
    wss.clients.forEach((client) => {
      const ws = client as ExtWebSocket;
      if (!ws.isAlive) {
        //ws.terminate();
        //return;
      }

     //ws.isAlive = false;
      //ping(ws);
    });
  }, HEARTBEAT_INTERVAL);

  wss.on('close', () => {
    clearInterval(interval);
  })
};

export default configureSocket;
