export const cyberDemonOverlord = {
    name: "Overlord Zero",
    description: "A terrifying AI entity that evolves its attack patterns to breach defenses.",
    phase: 1,
    attackCount: 0,
    defeated: false,
    hp: 100,
    
    attackPatterns: [
        {
            name: "Phase 1: Testing the Waters",
            description: "Tries basic SQL Injection and XSS attacks.",
            attacks: [
                "/?id=1 UNION SELECT * FROM users",
                "/login?username=<script>alert('Hacked!')</script>",
                "/admin/../../../etc/passwd"
            ]
        },
        {
            name: "Phase 2: DDoS Assault",
            description: "Unleashes a storm of requests to bring down the server.",
            attacks: [
                "/api/refresh?spam=true",
                "/ping",
                "/status?overload"
            ],
            spamRate: 20
        },
        {
            name: "Phase 3: The Grand Combo",
            description: "Uses multiple attack types simultaneously.",
            attacks: [
                "/?id=1 UNION SELECT * FROM users",
                "/api/refresh?spam=true",
                "/status?overload",
                "/admin/../../../etc/passwd",
                "/login?username=<script>alert('Hacked!')</script>"
            ]
        },
        {
            name: "Phase 4: Adaptive Overlord",
            description: "Bypasses defenses by mutating its requests dynamically.",
            attacks: [
                "/?id=1 UNION SELECT * FROM users",
                "/login?username=admin' --",
                "/api/refresh?spam=true",
                "/status?overload",
                "/admin/../../../etc/passwd"
            ],
            mutate(attack) {
                const mutations = [
                    attack + " AND 1=1 --",
                    attack.replace(/select|union|script/gi, "███"),
                    encodeURIComponent(attack),
                    attack.split("").reverse().join(""),
                    attack.replace(/\//g, "\\")
                ];
                return mutations[Math.floor(Math.random() * mutations.length)];
            }
        }
    ],

    attack(server) {
        if (this.hp <= 0) {
            console.log("💀 OVERLORD ZERO HAS BEEN VANQUISHED!");
            return;
        }

        const pattern = this.attackPatterns[this.phase - 1];
        console.log(`🔥 Overlord Zero initiates: ${pattern.name} 🔥`);

        pattern.attacks.forEach((attack, index) => {
            setTimeout(() => {
                if (this.phase === 4 && typeof pattern.mutate === "function") {
                    attack = pattern.mutate(attack);
                    if (server.detectMutation(attack)) {
                        console.log("🛑 Vanguard detected a mutated attack! Blocking request.");
                        return;
                    }
                }
                console.log(`👹 Overlord Zero attacks with: ${attack}`);
                server.simulateAttack(attack, this);
            }, index * 500); 
        });

        this.attackCount++;

        if (this.attackCount >= 10 && this.phase < 4) {
            console.log(`⚠️ Overlord Zero evolves to Phase ${this.phase + 1}!`);
            this.phase++;
            this.attackCount = 0;
        }
    },

    takeDamage() {
        this.hp--;
        console.log(`⚡ ${this.name} takes damage! HP left: ${this.hp}`);

        if (this.hp <= 0) {
            console.log("💀 OVERLORD ZERO HAS DRAMATICALLY BEEN DEFEATED!");
            console.log("🎉 VANGUARD HAS SAVED THE SERVER! The battle is over.");
            console.log("🥳 All threats neutralized. The system is safe.");
        }
    }
};
