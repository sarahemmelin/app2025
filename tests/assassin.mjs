export const assassin = {
    name: "Assassin",
    description: "A stealthy attacker that targets hidden vulnerabilities.",
    hp: 12,
    attackPath: "/hidden-admin-panel",
    attackInterval: null,

    attack(server) {
        if (this.hp <= 0) return; 
        console.log(`🔪 [Assassin Attack] ${this.attackPath}`);
        server.simulateAttack(this.attackPath, this.name);
    },

    takeDamage() {
        this.hp--;
        console.log(`⚡ Assassin takes damage! HP left: ${this.hp}`);

        if (this.hp <= 0) {
            console.log(`☠️ Assassin has been slain by Vanguard!`);
            clearInterval(this.attackInterval);
        }
    }
};