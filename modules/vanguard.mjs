import ReadableTime from '../utils/translateTime.mjs';
import { Worker } from "node:worker_threads";
import HTTP_CODES from "../utils/httpCodes.mjs";

const vanguard = {
    name: "Vanguard",
    description:
        "Vanguard is a tank class that specializes in defense and counter-attacks.",
    role: "tank",

    blacklistedIPs: new Set(["192.168.1.100", "45.33.23.21"]),
    dangerousPatterns: [/<script>/i, /union select/i, /eval\(/i, /\.\.\//i],
    requestCounts: {},
    DDOS_threshold: 10,

    skills: [
        {
            name: "Iron Wall",
            description: "Blocks known blacklisted IPs with his 403-shield.",
            use(req, res) {
                const ip = req.ip;
                if (vanguard.blacklistedIPs.has(ip)) {
                    vanguard.logEvent(ip, "🕵️ Thief", "BLACKLISTED", req.url);
                    res.status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN).send("🛡 Vanguard: Access Denied!");
                    return false;
                }
                return true;
            },
        },
        {
            name: "Defensive Stance",
            description: "Limits rapid requests to prevent spam attacks.",
            use(req, res) {
                const ip = req.ip;
                vanguard.requestCounts[ip] = (vanguard.requestCounts[ip] || 0) + 1;

                if (vanguard.requestCounts[ip] > vanguard.DDOS_threshold) {
                    vanguard.blacklistedIPs.add(ip);
                    vanguard.logEvent(ip, "🪓 Barbarian", "DDOS ATTEMPT BLOCKED", req.url);
                    res.status(HTTP_CODES.CLIENT_ERROR.TOO_MANY_REQUESTS)
                        .send("🛡 Vanguard: Too many requests! You are temporarily banned.");
                    return false;
                }
                return true;
            },
        },
        {
            name: " Ultimate Defense",
            description: "Activates legendary 418 shield defense!",
            use(req, res) {
                if (Math.random() < 0.01) { // 1% sjanse for super defense!
                    vanguard.logEvent(req.ip, "🔥 Boss", "DEFEATED BY VANGUARD", req.url);
                    res.status(HTTP_CODES.RPG_DEFENSE.SHIELD_BLOCK)
                        .send("☕ Vanguard: I am a teapot, you cannot break me!");
                    return false;
                }
                return true;
            },
        },
    ],

    logEvent(ip, enemy, reason, url) {
        const logStatement = `[${new Date().toISOString()}] ⚔️ ${enemy} attacked from ${ip}! Reason: ${reason}, Target: ${url}`;
        console.log("⚔️ Vanguard Log:", logStatement);

        const scribe = new Worker(new URL("../workers/scribe.mjs", import.meta.url));
        scribe.postMessage({ logStatement });
    }
};

export default vanguard;
