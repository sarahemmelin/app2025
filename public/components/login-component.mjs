class LoginComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        console.log("[LoginComponent] Konstruktør kjøres...");
        this.loadTemplate();
    }

    async loadTemplate() {
        try {
            console.log("Prøver å laste inn login - templaten");
            const response = await fetch("/templates/login.html");
            if (!response.ok) {
                throw new Error(`HTTP-feil! status: ${response.status}`);
            }
            const text = await response.text();
            const templateWrapper = document.createElement("div");
            templateWrapper.innerHTML = text;
            const template = templateWrapper.querySelector("template");
            if (template) {
                const clone = template.content.cloneNode(true);
                this.shadowRoot.appendChild(clone);
                this.setupEventListeners();
            } else {
                console.error("[LoginComponent] Fant ikke template-elementet.");
            }
        } catch (error) {
            console.error("[LoginComponent] Feil ved lasting av template:", error);
        }
    }

    setupEventListeners() {
        const loginBtn = this.shadowRoot.getElementById("loginBtn");
        if (loginBtn) {
            console.log("[LoginComponent] Knytter eventlistener til login-knappen!");
            loginBtn.addEventListener("click", () => this.login());
        } else {
            console.error("[LoginComponent] Fant ikke login-knappen!");
        }
    }
    

    async login() {
        const email = this.shadowRoot.getElementById("email").value;
        const password = this.shadowRoot.getElementById("password").value;

        console.log("[LoginComponent] Prøver å logge inn med e-post:", email, password)
        
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
    
        const result = await response.json();
        console.log("[LoginComponent] Resultat fra innlogging:", result);
        if (response.ok) {
            this.shadowRoot.getElementById("status").textContent = "Innlogging vellykket!";
            localStorage.setItem("authToken", result.token);
        } else {
            this.shadowRoot.getElementById("status").textContent = "Feil: " + result.message;
        }
    }
    
}

customElements.define("login-component", LoginComponent);