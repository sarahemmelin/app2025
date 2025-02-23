export function authenticateAPIKey(req, res, next) {
    const requestId = Math.random().toString(36).substring(7);

    if (req.headers["x-api-key"] !== process.env.API_KEY) {
        return res.status(401).json({ message: "Ugyldig API-nøkkel." }); 
    }

    next();
}