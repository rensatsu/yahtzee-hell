import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { randomUUID } from "node:crypto";
import { env } from "node:process";
import { Player } from "./utils/player.js";
import { Room } from "./utils/room.js";

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

/** @type {Map<string,Room>} */
const rooms = new Map();

/**
 * Generate random room ID.
 * @returns {string}
 */
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

function updateRoomState(roomId) {
    if (!rooms.has(roomId)) return;

    const room = rooms.get(roomId);

    const getPlayers = () => {
        const players = {};
        for (const [id, player] of room.getPlayers().entries()) {
            players[id] = {
                id: player.getId(),
                name: player.getName(),
                categories: player.getCategories(),
            }
        }

        return players;
    };

    io.to(roomId).emit("game-state", {
        players: getPlayers(),
        dices: [...room.getDices()],
        room: {
            players: room.getPlayers(),
            currentPlayer: room.getCurrentPlayer(),
        },
    });
}

io.on("connection", socket => {
    console.log("[io]", "User connected");

    socket.on("create-room", ({ username }, callback) => {
        const roomId = randomRoom();
        const room = new Room();
        rooms.set(roomId, room);
        socket.join(roomId);
        const player = new Player(socket.id, username);
        room.addPlayer(player);
        callback("room", roomId);
        updateRoomState(roomId);
    });

    socket.on("update-state", () => {
        socket.rooms.forEach((room) => {
            updateRoomState(room);
        });
    });

    socket.on("join-room", ({ room: roomId, username }, callback) => {
        if (rooms.has(roomId)) {
            socket.join(roomId);

            const player = new Player(socket.id, username);
            const room = rooms.get(roomId);

            room.addPlayer(player);
            callback(true, room);

            updateRoomState(roomId);
            return;
        }

        callback(false, "Room doesn't exist");
    });
});
