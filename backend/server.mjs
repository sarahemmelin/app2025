'use strict';
import express from 'express';
import shopAPI from './routes/shopAPI.mjs';
import authAPI from './routes/authAPI.mjs';
import { vanguard } from './middleware/vanguard.mjs';
import path from 'path';
import log, { eventLogger, LOGG_LEVELS } from './middleware/log.mjs';
import { DEBUG_MODE } from './config/debug.mjs';
import { fileURLToPath } from "url";
import HTTP_CODES from './utils/httpCodes.mjs';
import securityAPI from './routes/securityAPI.mjs';

if (DEBUG_MODE) console.log("DEBUG NODE_ENV:", process.env.NODE_ENV || "Ikke satt");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
server.use(express.json());

const port = process.env.PORT || 3000;
server.set('port', port);

const ignoredPaths = ["/favicon.ico", "/js/", "/css/", "/icons/", "/serviceWorker.js"];
server.use((req, res, next) => {
    if (ignoredPaths.some(path => req.url.startsWith(path))) return next();
    
    if (DEBUG_MODE) console.log(`[Vanguard] Sjekker tilgang til: ${req.url}`);
    
    for (const skill of vanguard.skills) {
        if (!skill.use(req, res)) {
            if (DEBUG_MODE) console.log(`[Vanguard] Blokkerte tilgang til: ${req.url}`);
            return;
        }
    }
    next();
});

server.use(log(LOGG_LEVELS.ALWAYS));
server.use((req, res, next) => {
    if (req.url.endsWith(".mjs")) {
        res.setHeader("Content-Type", "application/javascript");
    }
    next();
});

server.use(express.static(path.resolve(__dirname, "../frontend/public")));
server.use("/api/products", shopAPI);
server.use("/api/", authAPI);
server.use("/api", securityAPI);

server.get("*", (req, res) => {
    if (req.url.startsWith("/api")) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ message: "API-endepunktet finnes ikke" });
    }

    eventLogger(`Omdirigerer ${req.url} til /index.html`, LOGG_LEVELS.IMPORTANT);
    res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

server.listen(port, () => {
    if (DEBUG_MODE) console.log(`Server running at http://localhost:${port}`);
});

export { server };

