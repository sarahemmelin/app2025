class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        const template = document.getElementById("product-card-template");
        if (template) {
            const templateContent = template.content.cloneNode(true);
            this.shadowRoot.appendChild(templateContent);
        } else {
            console.error("Fant ikke `product-card-template`!");
        }
    }

    connectedCallback() {
        this.shadowRoot.querySelector(".product-name").textContent = this.getAttribute("navn") || "Ukjent produkt";
        this.shadowRoot.querySelector(".product-price").textContent = `Pris: ${this.getAttribute("pris") || "Ukjent"} kr`;
        this.shadowRoot.querySelector(".product-category").textContent = `Kategori: ${this.getAttribute("kategori") || "Ingen kategori"}`;
        this.shadowRoot.querySelector(".product-description").textContent = this.getAttribute("beskrivelse") || "Ingen beskrivelse.";


        const farge = this.getAttribute("farge");
        if (farge) {
            const fargeElement = document.createElement("p");
            fargeElement.textContent = `Farge: ${farge}`;
            this.shadowRoot.appendChild(fargeElement);
        }

        const pigment = this.getAttribute("pigment");
        if (pigment) {
            const pigmentElement = document.createElement("p");
            pigmentElement.textContent = `Pigmentnummer: ${pigment}`;
            this.shadowRoot.appendChild(pigmentElement);
        }
    }
}

customElements.define("product-card", ProductCard);