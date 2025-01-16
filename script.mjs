import express from 'express';
import HTTP_CODES from './utils/httpCodes.mjs';

const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);
server.use(express.static('public'));
server.use(express.json()); // Middleware for å lese JSON-data

// Rute: Root ("/") - Returnerer "Hello World"
// function getRoot(req, res, next) {
//     res.status(HTTP_CODES.SUCCESS.OK).send('Hello World').end();
// }
// server.get("/", getRoot);

function getPoem(req, res, next) {
    const poem = `
        En gammel dam. 
        En frosk hopper.
        Plask!
    `;
    res.status(HTTP_CODES.SUCCESS.OK).send(poem).end();
}
server.get("/tmp/poem", getPoem);

const quotes = [
    "The journey of a thousand miles begins with one step.",
    "Life is what happens when you’re busy making other plans.",
    "The purpose of our lives is to be happy.",
    "Get busy living or get busy dying.",
    "You only live once, but if you do it right, once is enough."
];

function getQuote(req, res, next) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote).end();
}
server.get("/tmp/quote", getQuote);

server.post('/tmp/sum', (req, res) => {
    const { a, b } = req.body;
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (isNaN(numA) || isNaN(numB)) {
        return res.status(400).send('Bad Request: Both parameters must be numbers.');
    }

    const sum = numA + numB;
    res.status(200).send(`The sum of ${numA} and ${numB} is ${sum}`);
});

function postSum(req, res, next) {
    const a = parseFloat(req.params.a);
    const b = parseFloat(req.params.b);

    if (isNaN(a) || isNaN(b)) {
        return res.status(400).send('Bad Request: Both parameters must be numbers.');
    }

    const sum = a + b;
    res.status(200).send(`The sum of ${a} and ${b} is ${sum}`);
}
server.post("/tmp/sum/:a/:b", postSum);


server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});
