//TODO:
// 1. AdminView har [ERROR adminView] og [ERROR HTTP-feil] for Error-meldinger. [DEBUG AdminView] for debug-meldinger.
// 2. Sette alle console.log inn i en if - sjekk for debugMode.
// 3. Vurdere om @param skal være med i kommentarene? Kan spørre Christian.

const DEBUG_MODE = true;

class AdminView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async loadTemplate() {
    try {
      const response = await fetch("/templates/adminView.html");
      if (!response.ok)
        throw new Error(`[ERROR AdminView] HTTP-feil ${response.status}`);

      const text = await response.text();
      const templateWrapper = document.createElement("div");
      templateWrapper.innerHTML = text;
      const template = templateWrapper.querySelector("template");

      if (template) {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.setupEventListeners();
      } else {
        console.error("[ERROR AdminView] Fant ikke template-elementet.");
      }
    } catch (error) {
      console.error("[ERROR AdminView] Feil ved lasting av template:", error);
    }
  }

  setupEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll("[data-view]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetView = button.getAttribute("data-view");

        if (this.currentView === targetView) {
          return;
        }

        this.currentView = targetView;
        this.initView(this.viewFunctions[targetView]);
      });
    });

    const logoutBtn = this.shadowRoot.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        document.dispatchEvent(new CustomEvent("logoutAttempt"));
      });
    } else {
      console.error("[ERROR AdminView] Fant ikke logout-knappen!");
    }
  }

  connectedCallback() {
    this.viewFunctions = {
      products: this.initViewFunction,
    };

    this.loadTemplate().then(() => {
      if (typeof this.initViewFunction === "function") {
        this.initView(this.initViewFunction);
      } else {
        console.error("[ERROR AdminView] initViewFunction er ikke definert!");
      }
    });
  }

  initView(viewFunction) {
    if (typeof viewFunction !== "function") {
      console.error("[ERROR AdminView] Ugyldig view-funksjon.");
      return;
    }

    const mainContent = this.shadowRoot.getElementById("mainContent");
    if (!mainContent) {
      console.error("[ERROR AdminView] Fant ikke mainContent i admin-view.");
      return;
    }

    mainContent.innerHTML = "";
    viewFunction(mainContent);
  }
}

customElements.define("admin-view", AdminView);
