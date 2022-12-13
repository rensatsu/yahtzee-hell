import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { randomUUID } from "node:crypto";
import { env } from "node:process";

const listenPort = env.HTTP_PORT ?? 7501;

const requiredEnv = ["HTTP_PORT", "CORS_ORIGIN", "FRONT_URL"];

const filteredEnvVars = requiredEnv.filter(eVar => !(eVar in env));
if (filteredEnvVars.length > 0) {
    throw new Error(
        `Required environment variables are not defined: ${filteredEnvVars.join(", ")}`
    );
}

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: env.CORS_ORIGIN
    }
});

app.use(cors);

const rooms = new Map();

const categories = {
    ones: "Ones",
    twos: "Twos",
    threes: "Threes",
    fours: "Fours",
    fives: "Fives",
    sixes: "Sixes",
    bonus: "Bonus (over 63)",
    threeOfKind: "Three of a Kind",
    fourOfKind: "Three of a Kind",
    fullHouse: "Full House",
    smallStraight: "Small Straight",
    largeStraight: "Large Straight",
    yahtzee: "Yahtzee",
    chance: "Chance",
}

class Player {
    #name;
    #categories;

    addCategory(category, points) {
        this.#categories[category] = points;
    }

    getName() {
        return this.#name;
    }

    getCategories() {
        return this.#categories;
    }

    constructor(name) {
        this.#name = name;
        this.#categories = {
            ones: null,
            twos: null,
            threes: null,
            fours: null,
            fives: null,
            sixes: null,
            bonus: false,
            threeOfKind: null,
            fourOfKind,
            fullHouse: null,
            smallStraight: null,
            largeStraight: null,
            yahtzee: null,
            chance: null,
        }
    }
}

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

server.listen(listenPort, "0.0.0.0", () => {
    console.log("[express]", `Listening on http://localhost:${listenPort}`);
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
