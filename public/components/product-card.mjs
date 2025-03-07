
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
          console.error("[ERROR] Fant ikke template-elementet.");
        }
      } catch (error) {
        console.error("[ERROR] Feil ved lasting av template:", error);
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
      const deleteBtn = shadow.querySelector(".delete-button");
  
      if (!productName || !productSKU || !productPrice || !productDescription || !productStock) {
        console.error("[ERROR] Templaten er ikke riktig lastet inn.");
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

      if (deleteBtn) {
        deleteBtn.addEventListener("click", (event) => this.handleDelete(event));
    } else {
        console.error("[ERROR] Fant ikke delete-knappen i DOM-en!");
    }

    }

   handleDelete(event) {
    event.stopPropagation();
    const productId = this.getAttribute("id");

    if (!productId) {
      console.error("[ERROR] Mangler produkt-ID, kan ikke slette.");
      return;
    }

    const isConfirmed = window.confirm(`Er du sikker på at du vil slette produktet med ID ${productId}?`);
    if (!isConfirmed) {
      console.log("[INFO] Sletting avbrutt");
      return;
    }

    this.dispatchEvent(new CustomEvent("deleteProduct", {
      detail: { productId },
      composed: true,
      bubbles: true,
    }));
  }

    connectedCallback() {
      if (this.shadowRoot.children.length > 0) {
        this.update();
      }
    }
  }
  
  customElements.define("product-card", ProductCard);
