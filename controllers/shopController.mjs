import fs from "fs/promises";
const filePath = "./data/shopProducts.json";

export async function getAllProducts(req, res) {
  try {
    const products = await getFileData(filePath);

    res.json(Object.values(products));

  } catch (error) {
    console.error([ERROR], "Feil ved henting av produkter", error);
    res.status(500).json({ message: "Feil ved henting av produkter", error });
  }
}

export async function getProduct(req, res) {
  try {
    const products = await getFileData(filePath);
    const product = products[req.params.id];

    if (!product)
      return res.status(404).json({ message: "Produkt ikke funnet" });

    res.json(product);
    
  } catch (error) {
    console.error("[ERROR], Feil ved henting av produkter", error);
    res.status(500).json({ message: "Feil ved henting av produkter", error });
  }
}

export async function createProduct(req, res) {
  try {
    console.log("[DEBUG] Mottatt body:", req.body);
    let { 
      navn, 
      kategori, 
      pris, 
      lager, 
      farge, 
      pigmenter, 
      beskrivelse, 
      sku } 
      = req.body;

      const products = await getFileData(filePath);

    kategori = kategori || ["ukjent"];
    if (!Array.isArray(pigmenter)) {
      pigmenter = pigmenter ? [pigmenter] : [];
  }


    if (!navn || !pris || !sku) {
      console.warn("[WARN] Mangler påkrevde felt");
      return res.status(400).json({ message: "Mangler påkrevde felt" });
    }

    let newId = "1";
    if (products && Object.keys(products).length > 0) {
        const existingIds = Object.keys(products).map(Number);
        const highestId = Math.max(...existingIds);
        newId = String(highestId + 1);
    }

    products[newId] = {
      id: newId,
      sku,
      navn,
      kategori: kategori || ["ukjent"],
      pris: Number(pris),
      lager: Number(lager) || 0,
      farge: farge || "Ukjent",
      pigmenter,
      beskrivelse: beskrivelse || "Ingen beskrivelse",
    };

    await fs.writeFile(filePath, JSON.stringify(products, null, 2));
    console.log("[DEBUG] Produkt lagret:", req.body);
    res
      .status(201)
      .json({
        message: `Produkt '${navn}' lagt til`,
        produkt: products[newId],
      });
  } catch (error) {
    console.error("[ERROR] Feil ved lagring av produkt", error);
    res
      .status(500)
      .json({ message: "Feil ved lagring av produkt", error: error.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const products = await getFileData(filePath);

    if (!products[id]) {
      return res.status(404).json({ message: `Produkt med ID ${id} ikke funnet` });
    }

    if (id === "0") {
      return res.status(403).json({ message: "Dummy-produktet kan ikke slettes!" });
    }

    delete products[id];

    await fs.writeFile(filePath, JSON.stringify(products, null, 2));

    console.log(`[DEBUG] Produkt med ID ${id} slettet.`);
    res.json({ message: `Produkt med ID ${id} slettet` });

  } catch (error) {
    console.error("[ERROR] Feil ved sletting av produkt", error);
    res.status(500).json({ message: "Feil ved sletting av produkt", error: error.message });
  }
}


const getFileData = async (filePath) => {
  try {
    const fileData = await fs.readFile(filePath, "utf-8");

    if (!fileData.trim()) {
      console.warn("[WARN] Filen er tom. Oppretter standarddata...");
      await resetProductsFile();
      return getFileData(filePath);
    }

    return JSON.parse(fileData);
    
  } catch (error) {
    console.error("[ERROR] Feil ved lesing av fil:", error.message);
    return {};
  }
};

const resetProductsFile = async () => {
  try {
    console.warn("[WARN] Gjenoppretter shopProducts.json...");

    const dummyProduct = {
      id: "0",
      sku: "DUMMY-PROD",
      navn: "Dummy produkt (kan ikke slettes)",
      kategori: ["Dummy"],
      pris: 0,
      lager: 100,
      farge: "Ukjent",
      pigment: "Ukjent",
      beskrivelse: "Dette er et dummy-produkt som ikke kan slettes",
    };

    await fs.writeFile(filePath, JSON.stringify({ "0": dummyProduct }, null, 2));
    console.log("[DEBUG] shopProducts.json er gjenopprettet med standarddata.");

  } catch (error) {
    console.error("[ERROR] Klarte ikke å gjenopprette produkter:", error.message);
  }
};


(async function checkAndResetProducts() {
  try {
    const fileData = await fs.readFile(filePath, "utf-8");

    if (!fileData.trim()) {
      console.warn("[WARN] shopProducts.json er tom. Oppretter standarddata...");
      await resetProductsFile();
    }

  } catch (error) {
    console.warn("[WARN] shopProducts.json mangler. Oppretter ny...");
    await resetProductsFile();
  }
})();
