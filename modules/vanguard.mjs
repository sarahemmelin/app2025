import ReadableTime from "../utils/translateTime.mjs";
import { Worker } from "node:worker_threads";
import HTTP_CODES from "../utils/httpCodes.mjs";
import sanitizeHtml from "sanitize-html";


const DEBUG_MODE = false;

export const vanguard = {
  name: "Vanguard",
  description:
    "Vanguard is a tank class that specializes in defense and counter-attacks.",
  role: "tank",

  blacklistedIPs: new Set(),
  blacklistedSubnets: new Set(),
  requestCounts: {},
  requestTimestamps: {},
  dangerousPatterns: [
    /<script>/i,
    /union select/i,
    /eval\(/i,
    /\.\.\//i,
    /(<script>|<\/script>)/gi,
    /\.\.\//gi,
  ],
  attackPatterns: new Map(),
  DDOS_threshold: 50,
  blacklistThreshold: 100,
  ipRotationThreshold: 5,
  timeWindow: 10000,
  tempBan: {},

  skills: [
    {
      name: "Cleanse",
      description: "Sanitizes user input and headers to prevent SQL/XSS attacks.",
      use(req, res) {
        const ip = vanguard.getIP(req);
        if (DEBUG_MODE){
          console.log("[Vanguard Debug] Full headers dump:", JSON.stringify(req.headers, null, 2));
        }

        const dataToCheck = [
          JSON.stringify(req.query),
          JSON.stringify(req.body),
          JSON.stringify(req.headers),
        ];

        if (vanguard.detectMaliciousPatterns(dataToCheck, ip, req, res)) {
          res.status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN).send("Vanguard: Malicious request blocked!");
          return false;
        }
        return true;
      }
    },
    {
      name: "Iron Wall",
      description: "Blocks known blacklisted IPs with his 403-shield.",
      use(req, res) {
        const ip = vanguard.getIP(req);
        const subnet = vanguard.getSubnet(ip);
        
        if (DEBUG_MODE){
          console.log(`[Vanguard Debug] Iron Wall is checking ${req.url} for IP: ${ip}`);
        }
    
        if (vanguard.blacklistedIPs.has(ip)) {
          console.warn(`[Vanguard] 🚨 BLOCKED ${ip} - Blacklisted IP!`);
          vanguard.logEvent(ip, "🛑 Blocked Attacker", "BLACKLISTED", req.url);
          res.status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN).send("Vanguard: Access Denied!");
          return false;
        }
    
        if (vanguard.blacklistedSubnets.has(subnet)) {
          console.warn(`[Vanguard] 🚨 BLOCKED ${ip} - Subnet ${subnet} is blacklisted!`);
          vanguard.logEvent(ip, "🕵️ A Thief", "BLACKLISTED SUBNET", req.url);
          res.status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN).send("Vanguard: Access Denied!");
          return false;
        }
    
        return true;
      },
    },
    {
      name: "Defensive Stance",
      description: "Limits rapid requests to prevent spam attacks.",
      use(req, res) {
        const ip = vanguard.getIP(req);
        const now = Date.now();

        if (DEBUG_MODE){
          console.log("[Vanguard Debug] requestCounts:", vanguard.requestCounts);
          console.log("[Vanguard Debug] requestTimestamps:", vanguard.requestTimestamps);
          console.log("[Vanguard Debug] blacklistedIPs:", vanguard.blacklistedIPs);
          console.log("[Vanguard Debug] Checking for IP:", ip);
        }

        if (vanguard.blacklistedIPs.has(ip)) {
          res.status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN).send("Vanguard: You are permanently banned.");
          return false;
        }

        if (vanguard.tempBan) vanguard.tempBan[ip] = {};
        if (vanguard.tempBan[ip] && now < vanguard.tempBan[ip]) {
          res.status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN).send("Vanguard: You are temporarily banned. Try again later.");
          return false;
        }

        vanguard.trackRequests(ip, now);
        return vanguard.checkRequestLimits(ip, now, res);
      },
    },
    {
      name: "Ultimate Defense",
      description: "Turns the server into a teapot, confusing attackers.",
      use(req, res) {
        const ip = vanguard.getIP(req);
        const now = Date.now();

        if (vanguard.requestCounts[ip] > vanguard.DDOS_threshold * 2) {
          console.warn(`[Vanguard] 🍵 ${ip} har spammet for mye! Aktiverer Teapot Defense!`);

          if (Math.random() < 0.5) {
            res.status(HTTP_CODES.RPG_DEFENSE.SHIELD_BLOCK).send("Vanguard: I am a teapot, you cannot break me!");
          } else {
            res.status(HTTP_CODES.SUCCESS.NO_CONTENT).send();
          }

          return false;
        }

        if (vanguard.tempBan[ip] && now < vanguard.tempBan[ip]) {
          console.warn(`[Vanguard] 🛑 ${ip} ignorerer temp-ban! Aktiverer stealth-mode!`);

          res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("Vanguard: This page does not exist.");
          return false;
        }

        if (vanguard.requestCounts[ip] > vanguard.blacklistThreshold - 5) {
          console.warn(`[Vanguard] 🐌 ${ip} er nær permaban! Slowing down requests.`);

          setTimeout(() => {
            res.status(HTTP_CODES.CLIENT_ERROR.TOO_MANY_REQUESTS).send("Vanguard: Too many requests, slow down!");
          }, 5000);

          return false;
        }

        return true;
      },
    },
  ],

  //===== Functions =========================================================//
  getIP(req) {
    return (
      req.headers["x-forwarded-for"] ||
      req.ip ||
      req.connection.remoteAddress ||
      "UNKNOWN_IP"
    );
  },

  getSubnet(ip) {
    return ip.split(".").slice(0, 2).join(".") + ".*.*";
  },

  trackRequests(ip, now) {
    if (!vanguard.requestTimestamps[ip]) vanguard.requestTimestamps[ip] = [];
    vanguard.requestTimestamps[ip] = vanguard.requestTimestamps[ip].filter(
      (ts) => now - ts < 10000
    );
    vanguard.requestTimestamps[ip].push(now);
  },

  checkRequestLimits(ip, now, res) {
    const recentRequests = vanguard.requestTimestamps[ip].length;

    if (DEBUG_MODE){
      console.log(
        `[Vanguard] 📊 IP: ${ip}, Recent requests in last 10s: ${recentRequests}`
      );
    }

    if (recentRequests > vanguard.DDOS_threshold) {
      console.warn(
        `[Vanguard] ⚠️ ${ip} sender for mange forespørsler på kort tid!`
      );

      if (!vanguard.tempBan[ip]) {
        vanguard.tempBan[ip] = now + 30000;
        console.warn(
          `[Vanguard] ⛔ ${ip} er midlertidig blokkert i 30 sekunder!`
        );
      } else if (recentRequests > vanguard.blacklistThreshold) {
        vanguard.blacklistedIPs.add(ip);
        vanguard.manageBlacklist("save", ip);
        console.warn(`[Vanguard] 🚫 ${ip} er permanent blokkert!`);
      }

      res.status(HTTP_CODES.CLIENT_ERROR.TOO_MANY_REQUESTS).send("Vanguard: Too many requests, slow down!");
      return false;
    }

    return true;
  },

  detectMaliciousPatterns(data, ip, req, res) {
    for (const pattern of vanguard.dangerousPatterns) {
      if (data.some((field) => pattern.test(field))) {
        console.warn(`Vanguard: Malicious request blocked from ${ip}!`);
        vanguard.logEvent(
          ip,
          "🕵️ A Thief",
          "MALICIOUS PATTERN DETECTED",
          req.url
        );
        res.status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN).send("Vanguard: Malicious request blocked!");
        return true;
      }
    }
    return false;
  },

  sanitizeRequest(req, ip, res) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeHtml(req.body[key]);
        if (
          /DROP\s+TABLE|INSERT\s+INTO|DELETE\s+FROM|SELECT\s+\*|UPDATE\s+\w+\s+SET/i.test(
            req.body[key]
          )
        ) {
          console.warn(`Vanguard: Blocked potential SQL attack from ${ip}!`);
          res.status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN).send("Vanguard: Suspicious activity detected!");
          return false;
        }
      }
    }
  },

  logEvent(ip, enemy, reason, url) {
    const logStatement = `[${ReadableTime}] ⚔️ ${enemy} attacked from ${ip}! Reason: ${reason}, Target: ${url}`;
    const scribe = new Worker(
      new URL("../workers/scribe.mjs", import.meta.url)
    );
    scribe.postMessage({ logStatement });
  },

  async manageBlacklist(action, ip = null) {
    const blacklistWorker = new Worker(
      new URL("../workers/blacklistWorker.mjs", import.meta.url)
    );
    if (action === "load") {
      blacklistWorker.postMessage({ type: "load" });

      blacklistWorker.on("message", (msg) => {
        if (msg.type === "loaded") {

          if(DEBUG_MODE){
            console.log("[Vanguard Debug] Loaded blacklist:", msg.data);
          };

          vanguard.blacklistedIPs = new Set(msg.data);
        }
      });
    } else if (action === "save" && ip) {
      vanguard.blacklistedIPs.add(ip);
      blacklistWorker.postMessage({
        type: "save",
        data: [...vanguard.blacklistedIPs],
      });

      if(DEBUG_MODE){
        console.log(`[Vanguard Debug] Blacklisted IP saved: ${ip}`);
      };
    }
  },
};

vanguard.manageBlacklist("load");

process.on("SIGINT", () => {
  console.log("📋 Innhold i blacklistedIPs før lagring:", [
    ...vanguard.blacklistedIPs,
  ]);
  vanguard.manageBlacklist("save");
  process.exit();
});
