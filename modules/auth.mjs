const activeTokens = new Set();

export function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "Manglende autorisasjon." });
    }

    const token = authHeader.split(" ")[1];

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
