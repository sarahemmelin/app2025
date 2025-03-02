

class ProductCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="/css/style.css">
        <div class="product-card">
          <h2 class="product-name">Laster...</h2>
          <p><strong>SKU:</strong> <span class="product-sku"></span></p>
          <p><strong>Pris:</strong> <span class="product-price"></span> kr</p>
          <p><strong>Kategori:</strong> <span class="product-category"></span></p>
          <p class="product-description"></p>
          <div class="extra-attributes"></div>
        </div>
      `;
    }
  
    connectedCallback() {
      this.update();
    }
  
    update() {
      this.shadowRoot.querySelector(".product-name").textContent = this.getAttribute("navn") || "Ukjent produkt";
      this.shadowRoot.querySelector(".product-sku").textContent = this.getAttribute("sku") || "Ukjent";
      this.shadowRoot.querySelector(".product-price").textContent = this.getAttribute("pris") || "Ukjent";
      this.shadowRoot.querySelector(".product-category").textContent = this.getAttribute("kategori") || "Ingen kategori";
      this.shadowRoot.querySelector(".product-description").textContent = this.getAttribute("beskrivelse") || "Ingen beskrivelse.";
  
      const extraAttributes = this.shadowRoot.querySelector(".extra-attributes");
      extraAttributes.innerHTML = "";
      const staticAttributes = ["navn", "sku", "pris", "kategori", "beskrivelse"];
  
      for (const attr of this.attributes) {
        if (!staticAttributes.includes(attr.name)) {
          const p = document.createElement("p");
          p.classList.add("product-info");
          p.innerHTML = `<strong>${attr.name}:</strong> ${this.getAttribute(attr.name)}`;
          extraAttributes.appendChild(p);
        }
      }
    }
  }
  
  customElements.define("product-card", ProductCard);
