'use strict';

import express from 'express';
import HTTP_CODES from './utils/httpCodes.mjs';
//Bryter ned koden først for å forstå hva som skjer
const app = express(); // Oppretter en instans av Express
// const port  = (process.env.PORT) || 8000; // Setter porten for serveren
//Har hatt problemer med å få denne porten til å fungere, endrer til:
const port = process.env.PORT || 8080;


app.set('port', port); // Setter porten for serveren
app.use(express.static('public')); // Middleware for å servere statiske filer
app.use(express.json()); // Middleware for å lese JSON-data

// Rute: Root ("/") - Returnerer "GZ"
function getRoot (req, res, next) { // En funksjon som tar imot en forespørsel, og sender en respons. (Request, Response, Next (som er neste funksjon i rekken))    
    res.status(HTTP_CODES.SUCCESS.OK).send("GZ").end(); // Sender en respons med statuskoden 200 (OK) og teksten "GZ"
} //.end() // Avslutter responsen, men er ikke alltid nødvendig etter .send() fordi .send() gjør det samme. Blir det som semikolon?

app.get("/", getRoot); // Setter opp en rute på rot ("/") som kjører funksjonen getRoot når den blir forespurt


//Simulering av en database
//DIKT
function getHaiku (req, res, next) {
    const haikuFrosk = `
    <pre>
        En gammel dam.
        En frosk hopper.
        Plask!
    </pre>
    `;

    res.status(HTTP_CODES.SUCCESS.OK).send(haikuFrosk).end();
};

app.get("/tmp/poem/haiku", getHaiku);

function getAlliteration (req, res, next) {
    const alliteration = `
    <pre>
        "To sit in solemn silence in a dull, dark dock,
        In a pestilential prison, with a lifelong lock,
        Awaiting the sensation of a short, sharp shock,
        From a cheap and chippy chopper on a big black block!"
        - The Mikado, Gilbert and Sullivan
    </pre>`;

    res.status(HTTP_CODES.SUCCESS.OK).send(alliteration).end();
};

app.get("/tmp/poem/alliteration", getAlliteration);

function getLimerick (req, res, next) {
    const limerick = `
    <pre>
        There once was a man from Peru,
        Who dreamed he was eating his shoe.
        He woke with a fright,
        In the middle of the night,
        To find that his dream had come true!
    </pre>`;

    res.status(HTTP_CODES.SUCCESS.OK).send(limerick).end();
};

app.get("/tmp/poem/limerick", getLimerick);

//QUOTES
const quotes = [
    "The only place success comes before work is in the dictionary.",
    "Life is what happens when you’re busy making other plans.",
    "Har du sett der du la den fra deg?",
    "Get busy living or get busy dying.",
    "You only live once, but if you do it right, once is enough."
];

function getQuote (req, res, next) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote).end();
}

app.get("/tmp/quote", getQuote);


//SUM (Skal bruke POST) - Skal ta imot to tall og returnere summen av dem

app.post("/tmp/sum", (req, res, next) => {
    const { a, b } = req.body;
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (isNaN(numA) || isNaN(numB)) {
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).send("Bad Request: Both parameters must be numbers.");
    }

    const sum = numA + numB;
    res.status(HTTP_CODES.SUCCESS.OK).send(`The sum of ${numA} and ${numB} is ${sum}`);
});

//Simulerer forskjellige HTTP-statuskoder

app.get("/tmp/simulate/:code", (req, res, next) => {
    const code = parseInt(req.params.code, 10);
    if (isNaN(code)) {
        res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).send("Bad Request: Code must be a number."); 
    } else {
        res.status(code).send("Response with status code ${code}").end();
    }
});


app.listen(app.get('port'), function () {
    console.log('server is running', app.get('port'));
});

//Ovennevnte kan forkortes slik:

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});