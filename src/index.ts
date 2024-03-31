import express from "express";
import http from "http";
import {json} from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import router from "./router";
import dbConnect from './db/dbConnect';
import configureSocket  from "./sockets";
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

configureSocket(server);
