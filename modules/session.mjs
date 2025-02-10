import * as crypto from 'crypto';

const SESSION_KEY = {};
const SESSIONS = {};

function startSession( req, res, next ) {
  let sessionId = req.get(SESSION_KEY);
  let session = SESSIONS[sessionId];

    if (!sessionId) {
        sessionId =  createUniqueId(20, SESSIONS);
        let session = { id: sessionId };
        SESSIONS[sessionId] = session;
    }

    res.set(SESSION_KEY, sessionId);
    req.session = session;
    next();

}

function updateSession(req, res, next) {
    SESSIONS[req.session.id] = req.session;
    next();
}

function createUniqueSessionId(length, sessions) {
    let id = ""; 
    do {
        id = crypto.randomBytes(length).toString('hex');
    } while (sessions[id] !== undefined);
    return id;
}

export { startSession, updateSession };