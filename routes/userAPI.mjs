import express from 'express';

const userRouter = express.Router();
userRouter.use(express.json());

export { userRouter };


//kan lage egne snippets som man kan injeksere i dokumenter (eks. i html-filer) for å få enkel tilgang til kode.
