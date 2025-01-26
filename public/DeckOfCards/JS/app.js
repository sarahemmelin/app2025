import { createDeck, drawCard, shuffleDeck, reshuffleDeck } from './api.js';
import { updateOutput, displayCard, addToDiscardPile, clearUI } from './ui.js';

let deckId = null;
let lastDrawnCard = null;

document.getElementById('createDeck').addEventListener('click', async () => {
    const deck = await createDeck();
    deckId = deck.deckId;
    updateOutput(`New deck created with ID: ${deckId}`);
    clearUI();
});

document.getElementById('drawCard').addEventListener('click', async () => {
    if (!deckId) {
        updateOutput("Please create a deck first!");
        return;
    }

    if (lastDrawnCard) {
        addToDiscardPile(lastDrawnCard);
    }

    const card = await drawCard(deckId);
    lastDrawnCard = card;
    displayCard(card);
    updateOutput(`You drew the ${card.value} of ${card.suit}`);
});

document.getElementById('shuffleDeck').addEventListener('click', async () => {
    if (!deckId) {
        updateOutput("Please create a deck first!");
        return;
    }
    await shuffleDeck(deckId);
    updateOutput("Deck shuffled successfully!");
});

document.getElementById('reshuffleDeck').addEventListener('click', async () => {
    if (!deckId) {
        updateOutput("Please create a deck first!");
        return;
    }
    const result = await reshuffleDeck(deckId);
    updateOutput(result.message);

    document.getElementById('discardContainer').innerHTML = "No discarded cards";
});