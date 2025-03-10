class LoginComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        console.log("[LoginComponent] Konstruktør kjøres...");
        this.loadTemplate();
    }

    async loadTemplate() {
        try {
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
            loginBtn.addEventListener("click", () => this.loginEvent());
        } else {
            console.error("[LoginComponent] Fant ikke login-knappen!");
        }
    }
    
    async loginEvent() {
        const email = this.shadowRoot.getElementById("email").value;
        const password = this.shadowRoot.getElementById("password").value; 

        this.dispatchEvent(new CustomEvent("loginAttempt", {
            detail: { email, password },
            bubbles: true,
            composed: true
        }));    
    }
}

customElements.define("login-component", LoginComponent);