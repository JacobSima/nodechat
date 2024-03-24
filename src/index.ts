import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import router from "./router";
import dbConnect from './db/dbConnect';
import { WebSocketServer, WebSocket} from "ws";

const app = express();

app.use(cors({
  credentials: true,
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json())

app.use('/', router());

const server =  http.createServer(app);

const PORT = 8000
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

dbConnect();


