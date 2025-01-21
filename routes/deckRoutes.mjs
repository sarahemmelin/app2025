import express from 'express';
import { createDeck, shuffleDeck, getDeck, getAllDecks, drawCard } from '../controllers/deckController.mjs';

const router = express.Router();

router.post('/deck', createDeck);
router.patch('/deck/shuffle/:deckId', shuffleDeck);
router.get('/deck/:deckId', getDeck);
router.get('/decks', getAllDecks);
router.get('/deck/draw/:deckId', drawCard);

export default router;