'use strict';

import express from 'express';
import path from 'path';
import deckRoutes from './routes/deckRoutes.mjs';
import poetryRoutes from './routes/poetryRoutes.mjs';
import log from './modules/log.mjs';


const server = express();
const port = process.env.PORT || 3000;


server.set('port', port);
server.use(express.static('public/DeckOfCards'));
server.use(express.json());
server.use(log);

function serveDeckPage(req, res) {
    res.sendFile(path.resolve('public/DeckOfCards/index.html'));
}

server.get("/", serveDeckPage);

server.use('/temp', deckRoutes);
server.use('/tmp', poetryRoutes);

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
