export const barbarian = {
    name: "Barbarian",
    description: "A brute-force attacker that tries to DDoS the server.",
    hp: 15,
    attackPath: "/flood-endpoint",
    attackInterval: null,

    attack(server) {
        if (this.hp <= 0) return;
        console.log(`🪓 [Barbarian Attack] ${this.attackPath}`);
        server.simulateAttack(this.attackPath, this.name);
    },

    takeDamage() {
        this.hp--;
        console.log(`⚡ Barbarian takes damage! HP left: ${this.hp}`);

        if (this.hp <= 0) {
            console.log(`☠️ Barbarian has been crushed by Vanguard!`);
            clearInterval(this.attackInterval); 
        }
    }
};