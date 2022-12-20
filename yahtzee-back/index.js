import express from "express";
import cors from "cors";
import { env } from "node:process";
import { generateDice } from "./utils/random.js";
import PouchDB from "pouchdb";
import ExpressPouchDB from "express-pouchdb";
import ExpressBodyParser from "body-parser";

// Check if required environment variables are defined
const requiredEnv = [
    "CORS_ORIGIN",
    "FRONT_URL",
    "POUCH_DB_CONFIG",
    "POUCH_DB_PATH",
    "POUCH_DB_LOG"
];

const filteredEnvVars = requiredEnv.filter(eVar => !(eVar in env));
if (filteredEnvVars.length > 0) {
    throw new Error(
        `Required environment variables are not defined: ${filteredEnvVars.join(", ")}`
    );
}

const app = express();
const corsOptions = {
    origin: [...env.CORS_ORIGIN.split(" ")],
    credentials: true,
};

const jsonParser = ExpressBodyParser.json({ strict: true });

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.get("/", (_, res) => {
    if (env.FRONT_URL) {
        res.redirect(env.FRONT_URL);
        return;
    }

    res.status(400).json({ error: "Bad request" });
});

app.post("/api/dice", jsonParser, (req, res) => {
    const resp = req.body.map((dice) => {
        if (dice.keep) return dice;
        dice.value = generateDice();
        return dice;
    });

    res.json(resp);
});

const defPouchDb = PouchDB.defaults({ prefix: env.POUCH_DB_PATH });
const expPouchDb = ExpressPouchDB(defPouchDb, {
    mode: "minimumForPouchDB",
    configPath: env.POUCH_DB_CONFIG,
    logPath: env.POUCH_DB_LOG
});

app.use("/db", expPouchDb);

app.listen(env.HTTP_PORT, "0.0.0.0", () => {
    console.log("[express]", `Listening on http://localhost:${env.HTTP_PORT}`);
});
