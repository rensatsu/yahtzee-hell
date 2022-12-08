import express from "express";
import { createServer } from "node:http";
import * as dotenv from "dotenv";
import { Server } from "socket.io";
import { randomUUID } from "node:crypto";

dotenv.config();

const listenPort = process.env.HTTP_PORT ?? 7500;

const app = express();
const server = createServer(app);
const io = new Server(server);

const rooms = new Map();

function randomRoom() {
    const room = "room-" + randomUUID();

    if (rooms.has(room)) {
        return randomRoom();
    }

    return room;
};

app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");
});

server.listen(listenPort, "0.0.0.0", () => {
    console.log("[express]", `Listening on http://localhost:${listenPort}`);
});

io.on("connection", socket => {
    console.log("[io]", "User connected");

    socket.on("create-room", () => {
        const room = randomRoom();
        socket.join(room);
        socket.emit("room", room);
    });

    socket.on("join-room", (room) => {
        if (rooms.has(room)) {
            socket.join(room);
            socket.emit("room", room);
            return;
        }

        socket.emit("join-room-error");
    });
});
