import { parentPort } from "node:worker_threads";
import fs from "node:fs/promises";

const removeAnsiCodes = (text) => text.replace(/\x1B\[[0-9;]*m/g, "");

parentPort.on("message", async (logText) => {
    
    let logStatement = removeAnsiCodes(logText.logStatement);
    console.log("📜 [Scribe Log]:", logStatement);

    try {
        await fs.appendFile("./logs/security.csv", logStatement + "\n");
    } catch (error) {
        console.error("Error from Scribe", error);
    }
});