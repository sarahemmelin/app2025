'use strict';
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
// import path from 'path';
import shopAPI from './routes/shopAPI.mjs';
// import log from './modules/log.mjs';
// import { LOGG_LEVELS, eventLogger } from './modules/log.mjs';
import { vanguard } from './modules/vanguard.mjs';
// import { updateSession } from './modules/session.mjs';
// import { startSession } from './modules/session.mjs';

const server = express();
server.use(express.json());
const port = process.env.PORT || 3000;

// const logger = log(LOGG_LEVELS.VERBOSE);


server.set('port', port);


server.use((req, res, next) => {
    console.log(`[Vanguard] Sjekker tilgang til: ${req.url}`);
    if (
        req.url === "/" ||
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

server.use("/shop/", shopAPI);
server.get("/", (req, res) => {
    res.sendFile("index.html", { root: "public" });
});

// server.use(updateSession);
// server.use(startSession);
// server.use(logger);


server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export { server };  