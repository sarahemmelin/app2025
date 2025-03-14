class AddProductForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.loadTemplate();
  }

  async loadTemplate() {
    try {
      const response = await fetch("/templates/addProductForm.html");
      if (!response.ok) {
        throw new Error(
          `[ERROR] Feil ved lasting av form-template: ${response.status}`
        );
      }
      const text = await response.text();
      const wrapper = document.createElement("div");
      wrapper.innerHTML = text;
      const template = wrapper.querySelector("template");
      if (template) {
        const clone = template.content.cloneNode(true);
        this.shadowRoot.appendChild(clone);
        this.addListeners();
      } else {
        console.error(
          "[ERROR] Fant ikke <template> elementet i addProductForm.html"
        );
      }
    } catch (error) {
      console.error(
        "[ERROR] Feil ved lasting av addProductForm template:",
        error
      );
    }
  }

  addListeners() {
    const form = this.shadowRoot.getElementById("addProductForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const newProduct = Object.fromEntries(formData.entries());

        this.dispatchEvent(
          new CustomEvent("addProduct", {
            detail: newProduct,
            bubbles: true,
            composed: true,
          })
        );
        form.reset();
      });
    }
  }
}

customElements.define("add-product-form", AddProductForm);
