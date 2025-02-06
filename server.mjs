'use strict';

import express from 'express';
import path from 'path';
import deckRoutes from './routes/deckRoutes.mjs';
import poetryRoutes from './routes/poetryRoutes.mjs';
import log from './modules/log.mjs';
import { LOGG_LEVELS, eventLogger } from './modules/log.mjs';

const server = express();
const port = process.env.PORT || 3000;

const logger = log(LOGG_LEVELS.VERBOSE);


server.set('port', port);
server.use(logger);
server.get("/", serveDeckPage); 
server.use(express.static('public/DeckOfCards'));
server.use(express.json());


function serveDeckPage(req, res) {
    eventLogger("Serving deck page");
    res.sendFile(path.resolve('public/DeckOfCards/index.html'));
}

server.use('/temp', deckRoutes);
server.use('/tmp', poetryRoutes);

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
