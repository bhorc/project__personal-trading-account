import dotenv from 'dotenv';
import express from "express";
import bodyParser from "body-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from 'mongoose';

import routers from "./routes/Routers.mjs";
import errorHandler from "./middlewares/ErrorHandlingMiddleware.mjs";

dotenv.config();
const {
    SESSION_SECRET_KEY,
    PORT = 3000,
} = process.env;

const app = express();
const server = createServer(app);
const io = new Server(server);

mongoose.connect(process.env.MONGODB_URL)
    .then(()=> {
        console.log('Database connected');
    })
    .catch((error)=> {
        console.log('Error connecting to database');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(session({
    secret: SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
}));
app.use('/api', routers);
app.use(errorHandler);

const start = async () => {
    try {
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}
start();