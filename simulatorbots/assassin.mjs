export const assassin = {
    name: "Assassin",
    description: "A stealthy attacker that targets hidden vulnerabilities.",
    hp: 12,
    attackPath: "/hidden-admin-panel",
    attackInterval: null,
  
    attack(server) {
      console.log(`🔪 [Assassin Attack] ${this.attackPath}`);
  
      setTimeout(() => {
        if (this.hp > 0) {
          console.log(`⚔️ Assassin prepares next attack...`);
          server.simulateAttack(this); 
        }
      }, 2000);
    },
  
    takeDamage() {
      this.hp--;
      console.log(`⚡ Assassin takes damage! HP left: ${this.hp}`);
      if (this.hp <= 0) {
        console.log(`☠️ Assassin has been defeated and will no longer attack!`);
        clearInterval(this.attackInterval);
      }
    },
  };
  