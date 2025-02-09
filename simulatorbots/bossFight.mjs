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
  simulateAttack(attacker) {
    if (!attacker) {
      console.error("🚨 Error: Undefined attacker in simulateAttack!");
      return;
    }

    if (attacker.hp <= 0) {
      console.log(`☠️ ${attacker.name} has been defeated and will no longer attack!`);
      return;
    }

    console.log("🔥 Debug: Attacker object ->", attacker);
    console.log(`⚔️ ${attacker.name} is attacking!`);

    attacker.attack(server);

    attackCount++;

    if (attackCount >= 10 && !overlordInterval) {
      console.log("🔥 CYBERDEMON OVERLORD HAS ENTERED THE SERVER! 🔥");

      overlordInterval = setInterval(() => {
        if (cyberDemonOverlord.hp > 0) {
          cyberDemonOverlord.attack(server);
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
        server.simulateAttack(enemy);
      }
    });
  }, 3000);
}

export { startBossFight };
