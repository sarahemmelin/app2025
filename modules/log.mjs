import ReadableTime from '../utils/translateTime.mjs';

let level_id = 0;

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
}

const log = function (loggLevel){
    currentGlobalLogLvl = loggLevel;
    return logInstance;
}

const logVerbose = (req, res, next) => {
    if (LOGG_LEVELS.VERBOSE == currentGlobalLogLvl) {
        printLog(req, res);
    }
}

const logImportant = (req, res, next) => {
    if (LOGG_LEVELS.IMPORTANT == currentGlobalLogLvl) {
        printLog(req, res);
    }
}

const logAlways = (req, res, next) => {
    if (LOGG_LEVELS.ALWAYS == currentGlobalLogLvl) {
        printLog(req, res);
    }
}

const printLog = (req, res) =>{
    console.log(`|${req.method}|${ReadableTime}|${req.url}`);
}

export default log;