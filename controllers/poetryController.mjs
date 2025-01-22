//DIKT
export function getHaiku (req, res, next) {
    const haikuFrosk = `
        En gammel dam.
        En frosk hopper.
        Plask!
    `;

    res.status(HTTP_CODES.SUCCESS.OK).send(haikuFrosk).end();
};

export function getAlliteration (req, res, next) {
    const alliteration = `

        "To sit in solemn silence in a dull, dark dock,
        In a pestilential prison, with a lifelong lock,
        Awaiting the sensation of a short, sharp shock,
        From a cheap and chippy chopper on a big black block!"
        - The Mikado, Gilbert and Sullivan
        `;

    res.status(HTTP_CODES.SUCCESS.OK).send(alliteration).end();
};

export function getLimerick (req, res, next) {
    const limerick = `
        There once was a man from Peru,
        Who dreamed he was eating his shoe.
        He woke with a fright,
        In the middle of the night,
        To find that his dream had come true!
        `;

    res.status(HTTP_CODES.SUCCESS.OK).send(limerick).end();
};

//QUOTES
const quotes = [
    "The only place success comes before work is in the dictionary.",
    "Life is what happens when you’re busy making other plans.",
    "Har du sett der du la den fra deg?",
    "Get busy living or get busy dying.",
    "You only live once, but if you do it right, once is enough."
];

export function getQuote (req, res, next) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote).end();
}


//SUM (Skal bruke POST) - Skal ta imot to tall og returnere summen av dem
export function summarizeNumbers (req, res, next) {
    const { a, b } = req.params;
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (isNaN(numA) || isNaN(numB)) {
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).send("Bad Request: Both parameters must be numbers.");
    }

    const sum = numA + numB;
    res.status(HTTP_CODES.SUCCESS.OK).send(`The sum of ${numA} and ${numB} is ${sum}`);
}
