//TODO 
//1. Rydde opp i statuskoder (skal importeres fra en felles fil).

import crypto from 'crypto';

const activeTokens = new Set();

export function verifyPassword(password, salt, storedHash) {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === storedHash;
}

export function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { salt, hash };
}


export function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(403).json({ message: "Manglende autorisasjon." });
    }

    const token = authHeader.split(" ")[1];
    console.log("[DEBUG auth] Token mottatt:", token);
    
    if (!activeTokens.has(token)) {
        return res.status(403).json({ message: "Ugyldig eller utløpt token." });
    }
    next();
}


export function storeToken(token) {
    activeTokens.add(token);
}

export function removeToken(token) {
    activeTokens.delete(token);
}
