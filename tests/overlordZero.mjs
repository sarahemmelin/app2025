const cyberDemonOverlord = {
    name: "Overlord Zero",
    description: "A terrifying AI entity that evolves its attack patterns to breach defenses.",
    phase: 1, 
    attackCount: 0,
    defeated: false,

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
            spamRate: 50
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
            mutate(req) {
                return req.replace(/users/g, "admins").replace(/login/g, "supersecure");
            }
        }
    ],

    attack(server) {
        if (this.defeated) return;

        const pattern = this.attackPatterns[this.phase - 1];
        console.log(`🔥 Overlord Zero initiates: ${pattern.name} 🔥`);

        for (const attack of pattern.attacks) {
            console.log(`👹 Overlord Zero attacks with: ${attack}`);
            server.simulateAttack(attack);
        }

        this.attackCount++;

        if (this.attackCount > 10 && this.phase < 4) {
            console.log(`⚠️ Overlord Zero evolves to Phase ${this.phase + 1}!`);
            this.phase++;
        }

        if (this.phase === 4) {
            console.log("🛠 Overlord Zero mutates its attack strategy!");
            for (let i = 0; i < pattern.attacks.length; i++) {
                pattern.attacks[i] = pattern.mutate(pattern.attacks[i]);
            }
        }
    },

    defeat() {
        console.log("💀 Overlord Zero has been vanquished! But for how long...? 😈");
        this.defeated = true;
    }
};

export default cyberDemonOverlord;
