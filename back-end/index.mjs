import dotenv from 'dotenv';
import express from "express";
import bodyParser from "body-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";
import fileUpload from 'express-fileupload';
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from 'mongoose';

import routers from "./routes/Routers.mjs";
import errorHandler from "./middlewares/ErrorHandlingMiddleware.mjs";


dotenv.config();
const {
    MONGODB_URL,
    SESSION_SECRET_KEY,
    PORT = 3000,
} = process.env;

const app = express();
const server = createServer(app);
const io = new Server(server);

mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log('Database connected');
    })
    .catch((error)=> {
        console.log('Error connecting to database');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({}));
app.use(cors({ origin: true, credentials: true }));
app.use(session({
    secret: SESSION_SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
        mongoUrl: MONGODB_URL,
        ttl: 1000 * 60 * 60 * 24 * 7,
    })
}));
app.use('/api', routers);
app.use(errorHandler);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});