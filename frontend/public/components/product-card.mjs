class ProductCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.editing = false;

    if (!this.getAttribute("id")) {
      console.warn("[WARNING] Produktkort opprettet uten ID, legges ikke til i DOM");
      return;
    }
      this.render();
  }

  static templateCache = {};

  static get observedAttributes() {
    return ["produktnavn", "sku", "pris", "lager", "beskrivelse", "id"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === "id" && oldValue === null) {
        if (this.isConnected) this.render();
      } else if (this.shadowRoot && this.shadowRoot.children.length > 0) {
        this.updateField(name, newValue);
      }
    }
  }
  

  updateField(name, value) {
    const shadow = this.shadowRoot;
    switch (name) {
      case "produktnavn":
        const productNameEl = shadow.querySelector(".product-name");
        if (productNameEl) productNameEl.textContent = value;
        break;
      case "sku":
        const productSKUEl = shadow.querySelector(".product-sku");
        if (productSKUEl) productSKUEl.textContent = value;
        break;
      case "pris":
        const productPriceEl = shadow.querySelector(".product-price");
        if (productPriceEl) productPriceEl.textContent = value;
        break;
      case "lager":
        const productStockEl = shadow.querySelector(".product-stock");
        if (productStockEl) productStockEl.textContent = value;
        break;
      case "beskrivelse":
        const productDescEl = shadow.querySelector(".product-description");
        if (productDescEl) productDescEl.textContent = value;
        break;
    }
  }

  async loadTemplateFromPath(templatePath, templateId) {
    if (ProductCard.templateCache[templateId]) {
      return ProductCard.templateCache[templateId].cloneNode(true);
    }
    try {
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`HTTP-feil! status: ${response.status}`);
      }
      const text = await response.text();
      const wrapper = document.createElement("div");
      wrapper.innerHTML = text;
      const template = wrapper.querySelector(`template#${templateId}`);
      if (template) {
        ProductCard.templateCache[templateId] = template.content.cloneNode(true);
        return ProductCard.templateCache[templateId].cloneNode(true);
      } else {
        console.error("[ERROR] Fant ikke template med id:", templateId);
        return null;
      }
    } catch (error) {
      console.error("[ERROR] Feil ved lasting av template:", error);
      return null;
    }
  }

  async render() {
    this.shadowRoot.innerHTML = "";

    const linkEl = document.createElement("link");
    linkEl.setAttribute("rel", "stylesheet");
    linkEl.setAttribute("href", "/css/style.css");
    this.shadowRoot.appendChild(linkEl);

    let templateContent;
    if (this.editing) {
      templateContent = await this.loadTemplateFromPath("/templates/productCardEdit.html", "product-card-edit-template");
    } else {
      templateContent = await this.loadTemplateFromPath("/templates/productCard.html", "product-card-template");
    }
    if (templateContent) {
      this.shadowRoot.appendChild(templateContent);
    }
    if (this.editing) {
      this.populateEditFields();
      this.setupEditListeners();
    } else {
      this.populateViewFields();
      this.setupViewListeners();
    }
  }

  populateViewFields() {
    const shadow = this.shadowRoot;
    const productNameEl = shadow.querySelector(".product-name");
    if (productNameEl) productNameEl.textContent = this.getAttribute("produktnavn") || "Ukjent produkt";
    const productSKUEl = shadow.querySelector(".product-sku");
    if (productSKUEl) productSKUEl.textContent = this.getAttribute("sku") || "Ukjent SKU";
    const productPriceEl = shadow.querySelector(".product-price");
    if (productPriceEl) productPriceEl.textContent = this.getAttribute("pris") || "Ukjent";
    const productDescEl = shadow.querySelector(".product-description");
    if (productDescEl) productDescEl.textContent = this.getAttribute("beskrivelse") || "Ingen beskrivelse.";
    const productStockEl = shadow.querySelector(".product-stock");
    if (productStockEl) productStockEl.textContent = this.getAttribute("lager") || "0";
  }

  setupViewListeners() {
    const shadow = this.shadowRoot;
    const editBtn = shadow.querySelector(".edit-button");
    if (editBtn) {
      editBtn.onclick = () => this.enterEditMode();
    }
    const deleteBtn = shadow.querySelector(".delete-button");
    if (deleteBtn) {
      deleteBtn.onclick = () => this.handleDelete();
    }
  }

  populateEditFields() {
    const shadow = this.shadowRoot;
    const nameInput = shadow.querySelector("input[name='produktnavn']");
    if (nameInput) nameInput.value = this.getAttribute("produktnavn") || "";
    const skuInput = shadow.querySelector("input[name='sku']");
    if (skuInput) skuInput.value = this.getAttribute("sku") || "";
    const priceInput = shadow.querySelector("input[name='pris']");
    if (priceInput) priceInput.value = this.getAttribute("pris") || "";
    const stockInput = shadow.querySelector("input[name='lager']");
    if (stockInput) stockInput.value = this.getAttribute("lager") || "";
    const descInput = shadow.querySelector("textarea[name='beskrivelse']");
    if (descInput) descInput.value = this.getAttribute("beskrivelse") || "";
  }

  setupEditListeners() {
    const shadow = this.shadowRoot;
    const saveBtn = shadow.querySelector(".save-button");
    if (saveBtn) {
      saveBtn.onclick = () => this.handleUpdate();
    }
    const cancelBtn = shadow.querySelector(".cancel-button");
    if (cancelBtn) {
      cancelBtn.onclick = () => this.exitEditMode();
    }
  }

  async enterEditMode() {
    this.editing = true;
    await this.render();
  }

  async exitEditMode() {
    const shadow = this.shadowRoot;
    const nameInput = shadow.querySelector("input[name='produktnavn']");
    if (nameInput) this.setAttribute("produktnavn", nameInput.value);
    const skuInput = shadow.querySelector("input[name='sku']");
    if (skuInput) this.setAttribute("sku", skuInput.value);
    const priceInput = shadow.querySelector("input[name='pris']");
    if (priceInput) this.setAttribute("pris", priceInput.value);
    const stockInput = shadow.querySelector("input[name='lager']");
    if (stockInput) this.setAttribute("lager", stockInput.value);
    const descInput = shadow.querySelector("textarea[name='beskrivelse']");
    if (descInput) this.setAttribute("beskrivelse", descInput.value);
    this.editing = false;
    await this.render();
  }

  handleUpdate() {
    const shadow = this.shadowRoot;
    const updatedData = {
      id: this.getAttribute("id"),
      produktnavn: shadow.querySelector("input[name='produktnavn']").value,
      sku: shadow.querySelector("input[name='sku']").value,
      pris: shadow.querySelector("input[name='pris']").value,
      lager: shadow.querySelector("input[name='lager']").value,
      beskrivelse: shadow.querySelector("textarea[name='beskrivelse']").value,
    };

    this.dispatchEvent(new CustomEvent("updateProduct", {
      detail: updatedData,
      bubbles: true,
      composed: true,
    }));
    this.exitEditMode();
  }

  handleDelete() {
    const productId = this.getAttribute("id");
    if (!productId) {
      console.error("[ERROR] Mangler produkt-ID, kan ikke slette.");
      return;
    }
    const isConfirmed = window.confirm(`Er du sikker på at du vil slette produktet med ID ${productId}?`);
    if (!isConfirmed) {
      return;
    }
    this.dispatchEvent(new CustomEvent("deleteProduct", {
      detail: { productId },
      bubbles: true,
      composed: true,
    }));
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define("product-card", ProductCard);