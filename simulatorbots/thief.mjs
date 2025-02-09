import { vanguard } from "../modules/vanguard.mjs";

export const thief = {
  name: "Thief",
  hp: 10,
  isDefeated: false,
  attackPath: "/?id=1 UNION SELECT * FROM users",

  getRandomIP() {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  },

  attack(server) {
    if (this.hp <= 0) {
      console.log(`☠️ ${this.name} is defeated and can no longer attack!`);
      return;
    }

    const fakeIP = this.getRandomIP();
    const attackURL = this.attackPath;

    console.log(`💀 [${this.name} Attack] from IP: ${fakeIP} -> ${attackURL}`);

    const fakeReq = { ip: fakeIP, url: attackURL };
    const fakeRes = {
      status: (code) => {
        console.log(`⚠️ Vanguard responds with HTTP ${code}`);
        return fakeRes;
      },
      send: (message) => console.log(`📢 Vanguard says: ${message}`),
    };

    vanguard.skills.forEach((skill) => {
      if (!this.isDefeated) {
        skill.use(fakeReq, fakeRes);
      }
    });

    if (this.hp <= 0) {
      this.isDefeated = true;
      console.log(`☠️ ${this.name} has been slain by Vanguard!`);
    }
  },

  takeDamage() {
    this.hp -= 1;
    console.log(`⚡ ${this.name} takes damage! HP left: ${this.hp}`);
  }
};