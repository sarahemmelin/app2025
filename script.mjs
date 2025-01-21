'use strict';

import express from 'express';
import HTTP_CODES from './utils/httpCodes.mjs';
import deckRoutes from './routes/deckRoutes.mjs';
import poetryRoutes from './routes/poetryRoutes.mjs';

const app = express();
const port = (process.env.PORT) || 3000;

app.set('port', port);
app.use(express.static('public'));
app.use(express.json());

// Rute for å sjekke tilkobling
app.get("/", (req, res) => {
    res.status(HTTP_CODES.SUCCESS.OK).send("You are connected!").end();
});

app.use('/temp', deckRoutes);
app.use('/tmp', poetryRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});