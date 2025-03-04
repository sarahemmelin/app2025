'use strict';
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import shopAPI from './routes/shopAPI.mjs';
import authAPI from './routes/authAPI.mjs';
import { vanguard } from './modules/vanguard.mjs';

const server = express();
server.use(express.json());
const port = process.env.PORT || 3000;

server.set('port', port);

server.use((req, res, next) => {
    console.log(`[Vanguard] Sjekker tilgang til: ${req.url}`);
    if (
        req.url.startsWith("/") ||
        req.url.startsWith("/favicon.ico") ||
        req.url.startsWith("/js/") ||
        req.url.startsWith("/css/") ||
        req.url.startsWith("/icons/") ||
        req.url.startsWith("/serviceWorker.js")
    ) {
        return next();
    }

    for (const skill of vanguard.skills) {
        if (!skill.use(req, res)) {
            console.log(`[Vanguard] Blokkerte tilgang til: ${req.url}`);
            return;
        }
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

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export { server };
