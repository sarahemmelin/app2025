import { parentPort } from "node:worker_threads";
import fs from "node:fs/promises";

parentPort.on('message', async (logText) => {

    const { logStatement } = logText;
    
    console.log("[Worker]", logStatement);
    
    try {
        await fs.appendFile("./logs/log.csv", logStatement + "\n");
    } catch (error) {
        console.error("Error from worker", error);
    }
});