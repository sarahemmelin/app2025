import ReadableTime from '../utils/translateTime.mjs';
import { text } from 'express';
import fs from "node:fs/promises";
import { Worker } from "node:worker_threads";

let level_id = 0;
let currentGlobalLogLvl = null;

export const LOGG_LEVELS = {
    VERBOSE: ++level_id,
    IMPORTANT: ++level_id,
    ALWAYS: ++level_id,
};

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

    return `"${methods[text]}${text}"`
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
    saveLog(logStatement);
};

const saveLog = (text) => {
    logWorker.postMessage({ logStatement: text });
};

export default log;