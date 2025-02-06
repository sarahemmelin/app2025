import { parentPort } from "node:worker_threads";
import fs from "node:fs/promises";

const removeAnsiCodes = (text) => text.replace(/\x1B\[[0-9;]*m/g, "");

parentPort.on('message', async (logText) => {

    let logStatement = logText.logStatement;
    console.log("[Worker]", logStatement);

    if (typeof logStatement === "string") {
        logStatement = removeAnsiCodes(logStatement);
    }
    
    try {
        await fs.appendFile("./logs/log.csv", logStatement + "\n");
    } catch (error) {
        console.error("Error from worker", error);
    }
});