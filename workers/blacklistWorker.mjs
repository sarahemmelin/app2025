import { parentPort } from "worker_threads";
import fs from "fs/promises";

console.log("🛠️ blacklistWorker started!"); 

const BLACKLIST_FILE = "blacklist.json";
const BLACKLIST_CSV = "./logs/blacklist.csv";
const removeAnsiCodes = (text) => text.replace(/\x1B\[[0-9;]*m/g, "");

async function saveBlacklist(blacklistedIPs) {
    try {
        console.log("BlacklistWorker lagrer følgende IP-er:", [...blacklistedIPs]); 
        await fs.writeFile(BLACKLIST_FILE, JSON.stringify([...blacklistedIPs], null, 2));

        const csvData = [...blacklistedIPs].map(ip => `${new Date().toISOString()},${ip}`).join("\n");
        await fs.appendFile(BLACKLIST_CSV, csvData + "\n");

        console.log("Blacklist saved successfully.");
    } catch (error) {
        console.error("Error saving blacklist:", error);
    }
}

async function loadBlacklist() {
    try {
        if (await fs.stat(BLACKLIST_FILE).then(() => true).catch(() => false)) {
            const data = await fs.readFile(BLACKLIST_FILE, "utf8");
            return new Set(JSON.parse(data));
        }
    } catch (error) {
        console.error("Error loading blacklist:", error);
    }
    return new Set();
}

parentPort.on("message", async (msg) => {
    console.log("Blacklistworker mottok melding:", msg);
    if (msg.type === "save") {
        await saveBlacklist(msg.data);
    } else if (msg.type === "load") {
        const loadedBlacklist = await loadBlacklist();
        parentPort.postMessage({ type: "loaded", data: loadedBlacklist });
    }
});
