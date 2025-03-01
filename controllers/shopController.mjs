import fs from "fs/promises";
const filePath = "./data/shopProducts.json";
const schemaFilePath = "./data/shopSchema.json";

export async function getAllProducts(req, res) {
  try {
    const products = await getFileData(filePath);
    res.json(Object.values(products));
  } catch (error) {
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
    console.log("Feil ved henting av produkter", error);
    res.status(500).json({ message: "Feil ved henting av produkter", error });
  }
}

export async function createProduct(req, res) {
  try {
    const { navn, kategori, pris, lager, farge, pigment, beskrivelse, sku } =
      req.body;

    if (!navn || !kategori || !pris || !sku) {
      return res.status(400).json({ message: "Mangler påkrevde felt" });
    }

    const products = await getFileData(filePath);

    const existingIds = Object.keys(products);
    const idNumber = existingIds.map((id) => Number(id));
    const highestId = Math.max(...idNumber);

    const newId = String(highestId + 1);

    products[newId] = {
      id: newId,
      sku,
      navn,
      kategori,
      pris,
      lager: lager || 0,
      farge: farge || "Ukjent",
      pigment: pigment || "Ukjent",
      beskrivelse: beskrivelse || "Ingen beskrivelse",
    };

    await fs.writeFile(filePath, JSON.stringify(products, null, 2));
    res
      .status(201)
      .json({
        message: `Produkt '${navn}' lagt til`,
        produkt: products[newId],
      });
  } catch (error) {
    console.error("Feil ved lagring av produkt", error);
    res
      .status(500)
      .json({ message: "Feil ved lagring av produkt", error: error.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const products = await getFileData(filePath);

    if (id === "0") {
      return res
        .status(403)
        .json({ message: "Dummy - produktet kan ikke slettes!" });
    }

    if (!products[id])
      return res
        .status(404)
        .json({ message: `Produkt med ID ${id} ikke funnet` });

    delete products[id];

    await fs.writeFile(filePath, JSON.stringify(products, null, 2));
    res.json({ message: `Produkt med id ${id} slettet` });
  } catch (error) {
    res.status(500).json({ message: "Feil ved sletting av produkt", error });
  }
}

const getFileData = async (filePath) => {
  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    const parsedData = JSON.parse(fileData);

    if (Object.keys(parsedData).length === 0) {
      console.log("Ingen data i filen");
      await resetProductsFile();
      return await getFileData(filePath);
    }
    return parsedData;
  } catch (error) {
    console.error("Feil ved lesing av fil", error);
    return {};
  }
};

const resetProductsFile = async () => {
    try {
        const schemaData = await fs.readFile(schemaFilePath, "utf-8");
        const schema  = JSON.parse(schemaData);

        const dummyProduct = {
            id: "0",
            sku: "DUMMY-PROD",
            navn: "Dummy produkt (kan ikke slettes)",
            kategori: ["Dummy"],
            pris: 0,
            lager: 100,
            farge: "Ukjent",
            pigment: "Ukjent",
            beskrivelse: "Dette er et dummy produkt som ikke kan slettes"
        };

        await fs.writeFile(filePath, JSON.stringify({ "0": dummyProduct }, null, 2));

    } catch (error) {
        console.error("Klarte ikke å gjenopprette produkter.", error);
    }
};

(async function checkAndResetProducts() {
  try {
      const fileData = await fs.readFile(filePath, "utf-8");
      if (!fileData.trim()) {
          console.log("shopProducts.json er tom. Oppretter standarddata...");
          await resetProductsFile();
      }
  } catch (error) {
      console.log("shopProducts.json mangler. Oppretter ny...");
      await resetProductsFile();
  }
})();