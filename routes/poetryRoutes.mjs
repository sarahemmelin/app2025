import express from 'express';
import { getHaiku, getAlliteration, getLimerick, getQuote, summarizeNumbers } from '../controllers/poetryController.mjs';

const router = express.Router();

router.get('/poem/haiku', getHaiku);
router.get('/poem/alliteration', getAlliteration);
router.get('/poem/limerick', getLimerick);
router.get('/quote', getQuote);
router.post('/sum', summarizeNumbers);
export default router;