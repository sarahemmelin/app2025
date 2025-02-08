export const thief = {
    name: "Thief",
    description: "A sneaky attacker that specializes in SQL Injection and stealing data.",
    hp: 10,
    attackPath: "/?id=1 UNION SELECT * FROM users",
    attackInterval: null,

    attack(server) {
        if (this.hp <= 0) return; 
        console.log(`🕵️ [Thief Attack] ${this.attackPath}`);
        server.simulateAttack(this.attackPath, this.name);
    },

    takeDamage() {
        this.hp--;
        console.log(`⚡ Thief takes damage! HP left: ${this.hp}`);

        if (this.hp <= 0) {
            console.log(`☠️ Thief has been defeated by Vanguard!`);
            clearInterval(this.attackInterval); 
        }
    }
};
