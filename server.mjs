'use strict';

import express from 'express';
// import path from 'path';
import shopAPI from './routes/shopAPI.mjs';
// import deckRoutes from './routes/deckRoutes.mjs';
// import poetryRoutes from './routes/poetryRoutes.mjs';
// import log from './modules/log.mjs';
// import { LOGG_LEVELS, eventLogger } from './modules/log.mjs';
// import { vanguard } from './modules/vanguard.mjs';
// import { startBossFight } from './simulatorbots/bossFight.mjs';
// import { updateSession } from './modules/session.mjs';
// import { startSession } from './modules/session.mjs';
// import { treeRouter } from './routes/treeAPI.mjs';
// import { questLogRouter } from './routes/questLogAPI.mjs';  
// import { userRouter } from './routes/userAPI.mjs';

const server = express();
server.use(express.json());
const port = process.env.PORT || 3000;

// const logger = log(LOGG_LEVELS.VERBOSE);


server.set('port', port);


// server.use((req, res, next) => {
//     for (const skill of vanguard.skills) {
//         if (!skill.use(req, res)) {
//             return;
//         }
//     }
//     next();
// });

server.use("/shop/", shopAPI);
server.get("/", (req, res) => {
    res.send("Gå til /shop for å hente produkter!");
});

// server.use(updateSession);
// server.use(startSession);
// server.use(logger);
// server.get("/", serveDeckPage); 
// server.use(express.static('public/DeckOfCards'));
// server.use("/tree/", treeRouter);

// server.use("/quest/", questLogRouter);
// server.use("/user/", userRouter); 

// server.use('/', deckRoutes);
// server.use('/tmp', poetryRoutes);

// {
//     "navn": "Winsor & Newton Gouache",
//     "kategori": ["Maling", "Gouache"],
//     "pris": 129.90,
//     "lager": 20,
//     "farge": "Blå",
//     "pigment": "PB15",
//     "sku": "WN-GOUACHE-BLUE"
// }

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    // console.log("VANGUARD IS READY TO DEFEND!");
    // startBossFight(); Denne fungerer ikke atm. 
});



// function serveDeckPage(req, res) {
//     eventLogger("Serving deck page");
//     res.sendFile(path.resolve('public/DeckOfCards/index.html'));
// }

export { server };  