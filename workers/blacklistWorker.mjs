import { parentPort } from "worker_threads";
import fs from "fs/promises";

const BLACKLIST_FILE = "./data/blacklist.json";

async function saveBlacklist(blacklistedIPs) {
    try {
        console.log("📂 [Blacklist Worker] Prøver å lagre blacklist:", blacklistedIPs);
        const jsonData = JSON.stringify([...blacklistedIPs], null, 2);
        console.log("✍️ JSON-data som skal skrives:", jsonData);

        await fs.writeFile(BLACKLIST_FILE, jsonData);
        console.log("✅ [Blacklist Worker] Lagret blacklist.json!");

        parentPort.postMessage({ type: "saved" });

    } catch (error) {
        console.error("❌ [Blacklist Worker] Feil ved lagring:", error);
    }
}

async function loadBlacklist() {
    try {
        const exists = await fs.access(BLACKLIST_FILE).then(() => true).catch(() => false);
        if (!exists) {
            console.log("⚠️ [Blacklist Worker] blacklist.json ikke funnet, oppretter ny fil...");
            await fs.writeFile(BLACKLIST_FILE, JSON.stringify([]));
            return new Set();
        }

        const data = JSON.parse(await fs.readFile(BLACKLIST_FILE, "utf8"));
        console.log("📂 [Blacklist Worker] Lastet inn blacklist:", data);
        return new Set(data);
    } catch (error) {
        console.error("❌ [Blacklist Worker] Feil ved lasting av blacklist:", error);
        return new Set();
    }
}

parentPort.on("message", async (msg) => {
    console.log("📩 [Blacklist Worker] Mottok melding:", msg);

    if (msg.type === "save") {
        await saveBlacklist(msg.data);
    } else if (msg.type === "load") {
        const loadedData = await loadBlacklist();
        parentPort.postMessage({ type: "loaded", data: [...loadedData] });
    }
});
