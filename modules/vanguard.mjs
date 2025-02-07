import ReadableTime from '../utils/translateTime.mjs';
import { Worker } from "node:worker_threads";


const vanguard = {
  name: "Vanguard",
  description:
    "Vanguard is a tank class that specializes in defense and counter - attacks.",
  role: "tank",
  skills: [
    {
      name: "Iron Wall",
      description: "Blocks known blacklisted IPs with his 403 - shield.",
      use(req, res) {
        const ip = req.ip;
      },
    },
    {
      name: "Parry and deflect",
      description: "Deflects malicious URL-attacks with his mighty sword.",
      use(req, res) {
        const url = req.url;
      },
    },
    {
      name: "Guard the ally",
      description:
        "Guard an ally (the server - lol), reducing the damage they take for a short period of time.",
      use(req, res) {
        //Kanskje telle antall requests og blokkere hvis det er for mange?
      },
    },
    {
      name: "Defensive Stance",
      description: "Limits rapid requests to prevent spam attacks.",
      use(req, res) {
        //Telle antall requests og blokkere hvis det er for mange.
      },
    },
    {
      name: "Counter-Attack",
      description: "Logs all malicious attempts.",
      use(req, res) {
        //Dette bør workeren ta seg av? Se på senere.
      },
    },
  ],
};

export default vanguard;
