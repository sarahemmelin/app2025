import { parentPort } from "node:worker_threads";
import fs from "node:fs/promises";
import path from "node:path";


CONST_LOG_DIR = "./logs";
const LOG_FILE = path.join(LOG_DIR, "log.csv");
const removeAnsiCodes = (text) => text.replace(/\x1B\[[0-9;]*m/g, "");

async function ensureLogDirExists() {
    try {
        await fs.mkdir(LOG_DIR, { recursive: true });
    } catch (error) {
        console.error("[Worker] Feil ved oppretting av logs-mappen:", error);
    }
}

parentPort.on('message', async (logText) => {

    let logStatement = logText.logStatement;
    console.log("[Worker]", logStatement);

    if (typeof logStatement === "string") {
        logStatement = removeAnsiCodes(logStatement);
    }
    
    try {
        await ensureLogDirExists();
        await fs.appendFile(LOG_FILE, logStatement + "\n");
    } catch (error) {
        console.error("Error from worker", error);
    }
});