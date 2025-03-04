
class ProductCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.loadTemplate();
    }
  
    async loadTemplate() {
      try {

        const response = await fetch("/templates/productCard.html");
        if (!response.ok) {
          throw new Error(`HTTP-feil! status: ${response.status}`);
        }
        const text = await response.text();
        const templateWrapper = document.createElement("div");
        templateWrapper.innerHTML = text;
        const template = templateWrapper.querySelector("template");
        if (template) {
          const clone = template.content.cloneNode(true);
          
          const linkElement = document.createElement("link");
          linkElement.setAttribute("rel", "stylesheet");
          linkElement.setAttribute("href", "/css/style.css");

          this.shadowRoot.appendChild(linkElement);
          this.shadowRoot.appendChild(clone);
          this.update();

        } else {
          console.error("[ProductCard] Fant ikke template-elementet.");
        }
      } catch (error) {
        console.error("[ProductCard] Feil ved lasting av template:", error);
      }
    }
  
    update() {
      const shadow = this.shadowRoot;
      
      const productName = shadow.querySelector(".product-name");
      const productSKU = shadow.querySelector(".product-sku");
      const productPrice = shadow.querySelector(".product-price");
      const productDescription = shadow.querySelector(".product-description");
      const productStock = shadow.querySelector(".product-stock");
      const extraAttributes = shadow.querySelector(".extra-attributes");
  
      if (!productName || !productSKU || !productPrice || !productDescription || !productStock) {
        console.error("[ProductCard] Templaten er ikke riktig lastet inn.");
        return;
      }
  
      productName.textContent = this.getAttribute("navn") || "Ukjent produkt";
      productSKU.textContent = this.getAttribute("sku") || "Ukjent";
      productPrice.textContent = `${this.getAttribute("pris") || "Ukjent"} kr`;
      productDescription.textContent = this.getAttribute("beskrivelse") || "Ingen beskrivelse.";
      productStock.textContent = this.getAttribute("lager") || "0";
  
      extraAttributes.innerHTML = "";
      const staticAttributes = ["navn", "sku", "pris", "lager", "beskrivelse"];
  
      for (const attr of this.attributes) {
        if (!staticAttributes.includes(attr.name)) {
          const p = document.createElement("p");
          p.classList.add("product-info");
          p.innerHTML = `<strong>${attr.name}:</strong> ${this.getAttribute(attr.name)}`;
          extraAttributes.appendChild(p);
        }
      }
    }
  
    connectedCallback() {
      if (this.shadowRoot.children.length > 0) {
        this.update();
      }
    }
  }
  
  customElements.define("product-card", ProductCard);
