import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { randomUUID } from "node:crypto";
import { env } from "node:process";

// Check if required environment variables are defined
const requiredEnv = ["HTTP_PORT", "CORS_ORIGIN", "FRONT_URL"];

const filteredEnvVars = requiredEnv.filter(eVar => !(eVar in env));
if (filteredEnvVars.length > 0) {
    throw new Error(
        `Required environment variables are not defined: ${filteredEnvVars.join(", ")}`
    );
}

// Create app
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: env.CORS_ORIGIN
    }
});

app.use(cors);

const rooms = new Map();

function randomRoom() {
    const room = randomUUID();

    if (rooms.has(room)) {
        return randomRoom();
    }

    return room;
}

app.get("/", (req, res) => {
    if (env.FRONT_URL) {
        res.redirect(env.FRONT_URL);
    }

    res.statusCode = 400;
    res.send("Bad request");
});

server.listen(env.HTTP_PORT, "localhost", () => {
    console.log("[express]", `Listening on http://localhost:${env.HTTP_PORT}`);
});

io.on("connection", socket => {
    console.log("[io]", "User connected");

    socket.on("create-room", (_, callback) => {
        const room = randomRoom();
        rooms.set(room, {});
        socket.join(room);
        callback("room", room);
    });

    socket.on("join-room", (room, callback) => {
        if (rooms.has(room)) {
            socket.join(room);
            callback(true, room);
            return;
        }

        callback(false, "Room doesn't exist");
    });
});
