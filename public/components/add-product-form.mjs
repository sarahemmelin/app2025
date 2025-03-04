class AddProductForm extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.loadTemplate();
    }
  
    async loadTemplate() {
      try {
        const response = await fetch('/templates/addProductForm.html');
        if (!response.ok) {
          throw new Error(`Feil ved lasting av form-template: ${response.status}`);
        }
        const text = await response.text();
        const wrapper = document.createElement('div');
        wrapper.innerHTML = text;
        const template = wrapper.querySelector('template');
        if (template) {
          const clone = template.content.cloneNode(true);
          this.shadowRoot.appendChild(clone);
          this.addListeners();
        } else {
          console.error('Fant ikke <template> elementet i addProductForm.html');
        }
      } catch (error) {
        console.error('Feil ved lasting av addProductForm template:', error);
      }
    }
  
    addListeners() {
      const form = this.shadowRoot.getElementById('addProductForm');
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          const newProduct = Object.fromEntries(formData.entries());
          console.log('Nytt produkt:', newProduct);

          const token = localStorage.getItem('authToken');
          if (!token) {
            console.error('Ingen token funnet! Brukeren er ikke logget inn.');
            return;
          }
  
          try {
            const response = await fetch('/shop/', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
               },
              body: JSON.stringify(newProduct)
            });
            if (!response.ok) {
              throw new Error(`Feil ved oppretting av produkt: ${response.status}`);
            }
            const result = await response.json();
            console.log('Produkt lagt til:', result);
          } catch (error) {
            console.error('Feil ved oppretting av produkt:', error);
          }
        });
      }
    }
  }
  
  customElements.define('add-product-form', AddProductForm);