//TODO:
// 1. Skal denne brukes videre? Da bør vi sannsynligvis gjøre denne om til en config - fil og flytte den inn i config - mappen. Prioriteres lavt.

import ReadableTime from '../utils/translateTime.mjs';
import { Worker } from 'node:worker_threads';

let level_id = 0;
let currentGlobalLogLvl = null;

export const LOGG_LEVELS = {
    VERBOSE: ++level_id,
    IMPORTANT: ++level_id,
    ALWAYS: ++level_id,
};

const ignoredPaths = [
    "/favicon.ico",
    "/manifest.webmanifest", 
    "/serviceWorker.js"
];

const ignoredPrefixes = [
    "/js/",
    "/css/",
    "/icons/",
    "/templates/"
];


let logInstance = (req, res, next) => {
        logVerbose(req, res);
        logImportant(req, res);
        logAlways(req, res);
        next();
};

const log = function (loggLevel){
    currentGlobalLogLvl = loggLevel;
    return logInstance;
};

export const eventLogger = function (eventDescription, loggLevel = LOGG_LEVELS.VERBOSE) {

    if (loggLevel >= currentGlobalLogLvl) {
        let logStatement = `|${ReadableTime}||${eventDescription}`;
        saveLog(logStatement);
    }
}

const colorize = (text) =>{
    const colors = {
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        reset: '\x1b[0m'
    }

    const methods = {
        GET: colors.green,
        POST: colors.yellow,
        DELETE: colors.red,
        PATCH: colors.blue,
        PUT: colors.blue
    }

    return `"${methods[text]}${text}${colors.reset}"`;
};

const logWorker = new Worker(new URL("../workers/logWorker.mjs", import.meta.url));

const logVerbose = (req, res, next) => {
    if (LOGG_LEVELS.VERBOSE == currentGlobalLogLvl) {
        printLog(req, res);
    }
};

const logImportant = (req, res, next) => {
    if (LOGG_LEVELS.IMPORTANT == currentGlobalLogLvl) {
       printLog(req, res);
    }
};

const logAlways = (req, res, next) => {
    if (LOGG_LEVELS.ALWAYS == currentGlobalLogLvl) {
        printLog(req, res);
    }
};

const printLog = (req, res) =>{


    let logStatement = `|${ReadableTime}||${colorize(req.method)}|${req.url}`;


    if (ignoredPaths.includes(req.url) || ignoredPrefixes.some(prefix => req.url.startsWith(prefix))) {
        return;
    }

    if (req.url === "/") {
        logStatement += " -> /index.html (root omdirigering)";
    } else if (!req.url.startsWith("/api") && !req.url.startsWith("/shop")) {
        logStatement += " -> /index.html (SPA-routing)";
    }
    saveLog(logStatement);
};

const saveLog = (text) => {
    logWorker.postMessage({ logStatement: text });
};

export default log;