import ReadableTime from "../utils/translateTime.mjs";
import { Worker } from "node:worker_threads";
import HTTP_CODES from "../utils/httpCodes.mjs";
import sanitizeHtml from "sanitize-html";
// import { thief } from "../simulatorbots/thief.mjs";
// import { barbarian } from "../simulatorbots/barbarian.mjs";
// import { assassin } from "../simulatorbots/assassin.mjs";
// import { cyberDemonOverlord } from "../simulatorbots/overlordZero.mjs";


export const vanguard = {
  name: "Vanguard",
  description:
    "Vanguard is a tank class that specializes in defense and counter-attacks.",
  role: "tank",

  blacklistedIPs: new Set(["192.168.1.100", "45.33.23.21"]),
  blacklistedSubnets: new Set(),
  requestCounts: {},
  dangerousPatterns: [/<script>/i, /union select/i, /eval\(/i, /\.\.\//i, /(<script>|<\/script>)/gi, /\.\.\//gi,],
  
  requestCounts: {},
  requestTimestamps: {},
  attackPatterns: new Map(),
  DDOS_threshold: 10,
  blacklistThreshold: 10,
  ipRotationThreshold: 5,
  timeWindow: 10000,

  skills: [
    {
      name: "Cleanse", 
      description: "Sanitizes user input and headers to prevent SQL/XSS attacks.",
      use(req, res) {
        const ip = req.headers["x-forwarded-for"] || req.ip || req.connection.remoteAddress;
        console.log("[Vanguard Debug] Full headers dump:", JSON.stringify(req.headers, null, 2));

        const dataToCheck = [
          JSON.stringify(req.query),
          JSON.stringify(req.body),
          JSON.stringify(req.headers),
        ];
    
        for (const pattern of vanguard.dangerousPatterns) {
          if (dataToCheck.some((field) => pattern.test(field))) {
            console.warn(`Vanguard: Malicious request blocked from ${ip}!`);
            vanguard.logEvent(ip, "🕵️ A Thief", "MALICIOUS PATTERN DETECTED", req.url);
            res.status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN).send("Vanguard: Malicious request blocked!");
            return false;
          }
        }
    
        for (const key in req.body) {
          if (typeof req.body[key] === "string") {
            req.body[key] = sanitizeHtml(req.body[key]);
    
            if (/DROP\s+TABLE|INSERT\s+INTO|DELETE\s+FROM|SELECT\s+\*|UPDATE\s+\w+\s+SET/i.test(req.body[key])) {
              console.warn(`Vanguard: Blocked potential SQL attack from ${ip}!`);
              vanguard.logEvent(ip, "A Hacker", "SQL ATTEMPT DETECTED", req.url);
              res.status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN).send("Vanguard: Suspicious activity detected!");
              return false;
            }
          } else {
            console.warn(`Vanguard Warning: Expected string for ${key}, received ${typeof req.body[key]}`);
          }
        }
    
        for (const key in req.headers) {
          if (typeof req.headers[key] === "string") {
            let sanitizedHeader = sanitizeHtml(req.headers[key]);
    
            if (/(<script[\s\S]*?>[\s\S]*?<\/script>|javascript:|onerror=|onload=|alert\(|document\.cookie)/i.test(req.headers[key])) {
              console.warn(`Vanguard: Blocked potential XSS attack in headers from ${ip}! Header: ${key}`);
              vanguard.logEvent(ip, "👺 A Hacker", `MALICIOUS HEADER DETECTED (${key})`, req.url);
              res.status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN).send("Vanguard: Suspicious activity detected!");
              return false;
            }
    
            req.headers[key] = sanitizedHeader;
          } else {
            console.warn(`Vanguard Warning: Expected string for header ${key}, received ${typeof req.headers[key]}`);
          }
        }
    
    const userAgent = req.headers["user-agent"];
    if (userAgent && /(<script>|<\/script>|javascript:|onerror=|onload=|alert\()/i.test(userAgent)) {
      console.warn(`[Vanguard] XSS Blocked: Suspicious User-Agent detected from ${ip}!`);
      vanguard.logEvent(ip, "🚨 XSS ATTACK", "User-Agent header contained script", req.url);
      res.status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN).send("Vanguard: Suspicious activity detected!");
      return false;
    }
    
        return true;
      }
    },    
    {
      //TODO: 
      // 1. Vanguard should save the IP address of the attacker and log it.
      // 2. If the IP address is blacklisted, respond with a 403 status code and the message "Vanguard: Access Denied!"
      name: "Iron Wall",
      description: "Blocks known blacklisted IPs with his 403-shield.",
      use(req, res) {
        const ip = req.headers["x-forwarded-for"] || req.ip || req.connection.remoteAddress;

    if (vanguard.blacklistedIPs.has(ip)) {
        res.status(403).send("Vanguard: Access Denied!");
        return false;
    }

        if (vanguard.blacklistedIPs.has(ip)) {
          res.status(403).send("Vanguard: Access Denied!");
          return false;
      }


        const subnet = ip.split(".").slice(0, 2).join(".") + ".*.*";
        if (vanguard.blacklistedIPs.has(ip) || vanguard.blacklistedSubnets.has(subnet)) {
          vanguard.logEvent(ip, "🕵️ A Thief", "BLACKLISTED", req.url);
          res.status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN).send("Vanguard: Access Denied!");
          vanguard.attackEnemy(req.url);
          return false;
        }

        const dataToCheck = [req.url,JSON.stringify(req.query), JSON.stringify(req.body), JSON.stringify(req.headers),];
        for (const pattern of vanguard.dangerousPatterns) {
          if (dataToCheck.some((field) => pattern.test(field))) {
            vanguard.logEvent(ip,"🕵️ A Thief","MALICIOUS PATTERN DETECTED",req.url);
            res.status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN).send("Vanguard: Malicious request blocked!");
            vanguard.attackEnemy(req.url);
            return false;
          }
        }
        return true;
      },
    },
    {
      //TODO: 
      // 1. Vanguard should save the IP address of the DDoS attacker and log it.
      name: "Defensive Stance",
      description: "Limits rapid requests to prevent spam attacks.",
      use(req, res) {
        const ip = req.headers["x-forwarded-for"] || req.ip || req.connection.remoteAddress;
        const now = Date.now();
        const attackSignature = req.url;
        
        if (!vanguard.attackPatterns.has(attackSignature)) {
          vanguard.attackPatterns.set(attackSignature, new Set());
        }
        vanguard.attackPatterns.get(attackSignature).add(ip);
        
        if (vanguard.attackPatterns.get(attackSignature).size > vanguard.ipRotationThreshold) {
          const subnet = ip.split(".").slice(0, 2).join(".") + ".*.*";
          vanguard.blacklistedSubnets.add(subnet);
          vanguard.logEvent(subnet, "🔥 IP ROTATION DETECTED", "SUBNET BLACKLISTED", attackSignature);
          res.status(HTTP_CODES.CLIENT_ERROR.FORBIDDEN).send("Vanguard: Suspicious activity detected! IP Range blocked.");
          return false;
        }

        if (!vanguard.requestTimestamps[ip]) {
          vanguard.requestTimestamps[ip] = [];
        }
        vanguard.requestTimestamps[ip].push(now);
        vanguard.requestTimestamps[ip] = vanguard.requestTimestamps[ip].filter(
          (timestamp) => now - timestamp < vanguard.timeWindow
        );

        // vanguard.requestCounts[ip] = vanguard.requestTimestamps[ip].length;
        if (!vanguard.requestCounts[ip]) {
          vanguard.requestCounts[ip] = 0;
      }
      vanguard.requestCounts[ip] += 1;

        if (vanguard.requestCounts[ip] > vanguard.DDOS_threshold) {
          vanguard.logEvent(
            ip, "🪓 A Barbarian","HIGH REQUEST RATE DETECTED",req.url);
        }

        if (vanguard.requestCounts[ip] > vanguard.blacklistThreshold) {
          vanguard.blacklistedIPs.add(ip);
          vanguard.manageBlacklist("save");
          vanguard.logEvent(ip,"🪓 BAN","IP BLACKLISTED FOR DDoS",req.url);
          res.status(HTTP_CODES.CLIENT_ERROR.TOO_MANY_REQUESTS).send("Vanguard: Too many requests! You are permanently banned");
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

  // attackEnemy(url) {
  //   if (url.includes(thief.attackPath)) {
  //     thief.takeDamage();
  //   } else if (url.includes(assassin.attackPath)) {
  //     assassin.takeDamage();
  //   } else if (url.includes(barbarian.attackPath)) {
  //     barbarian.takeDamage();
  //   } else {
  //     cyberDemonOverlord.takeDamage();
  //   }
  // },

  logEvent(ip, enemy, reason, url) {
    const logStatement = `[${ReadableTime}] ⚔️ ${enemy} attacked from ${ip}! Reason: ${reason}, Target: ${url}`;

    const scribe = new Worker(new URL("../workers/scribe.mjs", import.meta.url));
    scribe.postMessage({ logStatement });
  },

  manageBlacklist(action, data = null) {
    const blacklistWorker = new Worker(new URL("../workers/blacklistWorker.mjs", import.meta.url));
  
    if (action === "load") {
      blacklistWorker.postMessage({ type: "load" });
  
      blacklistWorker.on("message", (msg) => {
        if (msg.type === "loaded") {
          vanguard.blacklistedIPs = new Set(msg.data);
          console.log("Vanguard: Blacklist loaded.");
        }
      });
    }
  
    if (action === "save") {
      blacklistWorker.postMessage({ type: "save", data: [...vanguard.blacklistedIPs] });
    
      blacklistWorker.on("message", (msg) => {
        if (msg.type === "saved") {
        }
      });
    }
  },
};

vanguard.manageBlacklist("load");

process.on("SIGINT", () => {
  console.log("📋 Innhold i blacklistedIPs før lagring:", [...vanguard.blacklistedIPs]);
  vanguard.manageBlacklist("save");
  process.exit();
});