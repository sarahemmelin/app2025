import { vanguard } from "../modules/vanguard.mjs";
import { thief } from "./thief.mjs";
import { assassin } from "./assassin.mjs";
import { barbarian } from "./barbarian.mjs";
import { cyberDemonOverlord } from "./overlordZero.mjs";

let attackCount = 0;
let activeEnemies = [thief, assassin, barbarian];
let bossFightInterval = null;
let overlordInterval = null;

const server = {
  simulateAttack(attack, attacker) {
    if (!attacker) {
      console.error("🚨 Error: Undefined attacker in simulateAttack!", attack);
      return;
    }

    if (attacker.hp <= 0) {
      console.log(
        `☠️ ${attacker.name} has been defeated and will no longer attack!`
      );
      return;
    }

    console.log(`🚨 [${attacker.name} Attack] ${attack}`);

    const fakeReq = { ip: "66.66.66.66", url: attack };
    const fakeRes = {
      status: (code) => {
        console.log(`⚠️ Vanguard responds with HTTP ${code}`);
        return fakeRes;
      },
      send: (message) => console.log(`📢 Vanguard says: ${message}`),
    };

    vanguard.skills.forEach((skill) => {
      if (!attacker.isDefeated) {
        skill.use(fakeReq, fakeRes);
      }
    });

    if (attacker.hp <= 0) {
      attacker.isDefeated = true;
      console.log(`☠️ ${attacker.name} has been slain by Vanguard!`);
      activeEnemies = activeEnemies.filter((enemy) => enemy.hp > 0);
    }

    attackCount++;

    if (attackCount >= 10 && !overlordInterval) {
      console.log("🔥 CYBERDEMON OVERLORD HAS ENTERED THE SERVER! 🔥");

      overlordInterval = setInterval(() => {
        if (cyberDemonOverlord.hp > 0) {
          cyberDemonOverlord.attack(server, cyberDemonOverlord);
        } else {
          console.log("💀 OVERLORD ZERO HAS BEEN VANQUISHED!");
          clearInterval(overlordInterval);
          overlordInterval = null;
        }
      }, 5000);
    }
  },
};

function startBossFight() {
  console.log("⚔️ THE BATTLE BEGINS! Enemies are attacking!");

  bossFightInterval = setInterval(() => {
    if (activeEnemies.length === 0) {
      console.log("🏆 All enemies defeated! The server is safe.");
      clearInterval(bossFightInterval);
      bossFightInterval = null;
      return;
    }

    activeEnemies.forEach((enemy) => {
      if (enemy.hp > 0) {
        enemy.attack(server);
      }
    });
  }, 3000);
}

export { startBossFight };
