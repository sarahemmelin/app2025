import { parentPort } from "worker_threads";
// import fs from "fs/promises";
// import path from "path";
// import { fileURLToPath } from "url";
import pool from "../config/dbConnect.mjs";

async function saveBlacklist(blacklistedIPs) {
    try {
        await pool.query("TRUNCATE TABLE blacklist RESTART IDENTITY;");
        for (const ip of blacklistedIPs) {
            await pool.query("INSERT INTO blacklist (ip, reason) VALUES ($1, 'Automatisk blokkering') ON CONFLICT (ip) DO NOTHING;", [ip]);
        }

        console.log("[Blacklist Worker] Lagret blacklist i databasen!");
        parentPort.postMessage({ type: "saved" });

    } catch (error) {
        console.error("[Blacklist Worker] Feil ved lagring til database:", error);
    }
}

async function loadBlacklist() {
    try {
        const result = await pool.query("SELECT ip FROM blacklist;");
        const blacklistedIPs = new Set(result.rows.map(row => row.ip));

        console.log("[Blacklist Worker] Lastet inn blacklist fra databasen:", [...blacklistedIPs]);
        return blacklistedIPs;
    } catch (error) {
        console.error("[Blacklist Worker] Feil ved lasting av blacklist fra database:", error);
        return new Set();
    }
}

parentPort.on("message", async (msg) => {
    console.log("[Blacklist Worker] Mottok melding:", msg);

    if (msg.type === "save") {
        await saveBlacklist(msg.data);
    } else if (msg.type === "load") {
        const loadedData = await loadBlacklist();
        parentPort.postMessage({ type: "loaded", data: [...loadedData] });
    }
});
