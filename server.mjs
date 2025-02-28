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
    for (const skill of vanguard.skills) {
        if (!skill.use(req, res)) {
            return;
        }
    }
    next();
});

server.use("/shop/", shopAPI);
server.get("/", (req, res) => {
    res.sendFile("index.html", { root: "public" });
});

// server.use(updateSession);
// server.use(startSession);
// server.use(logger);
// server.use(express.static('public/DeckOfCards'));
// server.use("/tree/", treeRouter);

// server.use("/quest/", questLogRouter);
// server.use("/user/", userRouter); 

// server.use('/', deckRoutes);
// server.use('/tmp', poetryRoutes);


server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export { server };  