'use strict';

import express from 'express';
import path from 'path';
// import HTTP_CODES from './utils/httpCodes.mjs';
import deckRoutes from './routes/deckRoutes.mjs';
import poetryRoutes from './routes/poetryRoutes.mjs';

const app = express();
const port = process.env.PORT || 3000;

app.set('port', port);
app.use(express.static('public/DeckOfCards'));
app.use(express.json());

// Rot-rute: Automatisk servering av index.html
app.get("/", (req, res) => {
    res.sendFile(path.resolve('public/DeckOfCards/index.html'));
});

// Registrer API-ruter
app.use('/temp', deckRoutes);
app.use('/tmp', poetryRoutes);

// Start serveren
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
