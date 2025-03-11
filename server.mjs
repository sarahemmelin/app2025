'use strict';
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import shopAPI from './routes/shopAPI.mjs';
import authAPI from './routes/authAPI.mjs';
import { vanguard } from './modules/vanguard.mjs';
import path from 'path';
import log, { eventLogger, LOGG_LEVELS } from './modules/log.mjs';

const server = express();
server.use(express.json());
const port = process.env.PORT || 3000;

server.set('port', port);

server.use((req, res, next) => {
    const ignoredPaths = [
        "/favicon.ico",
        "/js/",
        "/css/",
        "/icons/",
        "/serviceWorker.js"
    ];

    if (ignoredPaths.some(path => req.url.startsWith(path))) {
        return next();
    }
    console.log(`[Vanguard] Sjekker tilgang til: ${req.url}`);

    for (const skill of vanguard.skills) {
        if (!skill.use(req, res)) {
            console.log(`[Vanguard] Blokkerte tilgang til: ${req.url}`);
            return;
        }
    }
    next();
});


server.use(log(LOGG_LEVELS.ALWAYS));

server.use((req, res, next) => {
    if (req.url.endsWith(".mjs")) {
        res.setHeader("Content-Type", "application/javascript");
    }
    next();
});

server.use(express.static("public"));

server.get("/offline.html", (req, res) => {
    res.sendFile("offline.html", { root: "public" });
});

server.use("/shop/", shopAPI);
server.use("/", authAPI);

server.get("/", (req, res) => {
    res.sendFile("index.html", { root: "public" });
});

server.get("*", (req, res, next) => {
    if (req.url.startsWith("/shop/") || req.url.startsWith("/login")) {
        return next();
    }
    eventLogger(`Omdirigerer ${req.url} til /index.html`, LOGG_LEVELS.IMPORTANT);
    res.sendFile(path.resolve("public/index.html"));
});

// server.get("*", (req, res) => {
//     eventLogger(`Omdirigerer ${req.url} til /index.html`, LOGG_LEVELS.IMPORTANT);
//     res.sendFile(path.resolve("public/index.html"));
// });

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export { server };
