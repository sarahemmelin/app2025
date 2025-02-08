import ReadableTime from "../utils/translateTime.mjs";
import { Worker } from "node:worker_threads";
import HTTP_CODES from "../utils/httpCodes.mjs";
import { thief } from "../tests/thief.mjs";
import { barbarian } from "../tests/barbarian.mjs";
import { assassin } from "../tests/assassin.mjs";
import { cyberDemonOverlord } from "../tests/overlordZero.mjs";

export const vanguard = {
  name: "Vanguard",
  description:
    "Vanguard is a tank class that specializes in defense and counter-attacks.",
  role: "tank",

  blacklistedIPs: new Set(["192.168.1.100", "45.33.23.21"]),
  dangerousPatterns: [/<script>/i, /union select/i, /eval\(/i, /\.\.\//i],
  requestCounts: {},
  requestTimestamps: {},
  DDOS_threshold: 10,
  blacklistThreshold: 20,
  timeWindow: 10000,

  skills: [
    {
      name: "Iron Wall",
      description: "Blocks known blacklisted IPs with his 403-shield.",
      use(req, res) {
        const ip = req.ip;

        if (vanguard.blacklistedIPs.has(ip)) {
          vanguard.logEvent(ip, "🕵️ Thief", "BLACKLISTED", req.url);
          res
            .status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN)
            .send("Vanguard: Access Denied!");
          vanguard.attackEnemy(req.url);
          return false;
        }

        const dataToCheck = [
          req.url,
          JSON.stringify(req.query),
          JSON.stringify(req.body),
          JSON.stringify(req.headers),
        ];

        for (const pattern of vanguard.dangerousPatterns) {
          if (dataToCheck.some((field) => pattern.test(field))) {
            vanguard.logEvent(
              ip,
              "🕵️ Thief",
              "MALICIOUS PATTERN DETECTED",
              req.url
            );
            res
              .status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN)
              .send("Vanguard: Malicious request blocked!");
            vanguard.attackEnemy(req.url);
            return false;
          }
        }
        return true;
      },
    },
    {
      name: "Defensive Stance",
      description: "Limits rapid requests to prevent spam attacks.",
      use(req, res) {
        const ip = req.ip;
        const now = Date.now();
        
        if (!vanguard.requestTimestamps[ip]) {
          vanguard.requestTimestamps[ip] = [];
        }
        vanguard.requestTimestamps[ip].push(now);
        vanguard.requestTimestamps[ip] = vanguard.requestTimestamps[ip].filter(
          (timestamp) => now - timestamp < vanguard.timeWindow
        );

        vanguard.requestTimestamps[ip] = vanguard.requestedTimestamps[ip].length;

        if (vanguard.requestCounts[ip] > vanguard.DDOS_threshold) {
          vanguard.logEvent(
            ip, 
            "🪓 Barbarian",
            "HIGH REQUEST RATE DETECTED",
            req.url
            );
        }

        // vanguard.requestCounts[ip] = (vanguard.requestCounts[ip] || 0) + 1;

        if (vanguard.requestCounts[ip] > vanguard.blacklistThreshold) {
          vanguard.blacklistedIPs.add(ip);
          vanguard.logEvent(
            ip,
            "🪓 BAN",
            "IP BLACKLISTED FOR DDoS",
            req.url
          );
          res
            .status(HTTP_CODES.CLIENT_ERROR.TOO_MANY_REQUESTS)
            .send("Vanguard: Too many requests! You are permanently banned");
          vanguard.attackEnemy(req.url);
          return false;
        }

        return true;
      },
    },
    {
      name: "Ultimate Defense",
      description: "Activates legendary 418 shield defense!",
      use(req, res) {
        if (Math.random() < 0.01) {
          vanguard.logEvent(req.ip, "🔥 Boss", "DEFEATED BY VANGUARD", req.url);
          res
            .status(HTTP_CODES.RPG_DEFENSE.SHIELD_BLOCK)
            .send("Vanguard: I am a teapot, you cannot break me!");

          cyberDemonOverlord.takeDamage();
          cyberDemonOverlord.takeDamage();

          return false;
        }
        return true;
      },
    },
  ],

  attackEnemy(url) {
    if (url.includes(thief.attackPath)) {
      thief.takeDamage();
    } else if (url.includes(assassin.attackPath)) {
      assassin.takeDamage();
    } else if (url.includes(barbarian.attackPath)) {
      barbarian.takeDamage();
    } else {
      cyberDemonOverlord.takeDamage();
    }
  },

  logEvent(ip, enemy, reason, url) {
    const logStatement = `[${ReadableTime}] ⚔️ ${enemy} attacked from ${ip}! Reason: ${reason}, Target: ${url}`;
    console.log("⚔️ Vanguard Log:", logStatement);

    const scribe = new Worker(
      new URL("../workers/scribe.mjs", import.meta.url)
    );
    scribe.postMessage({ logStatement });
  },
};
