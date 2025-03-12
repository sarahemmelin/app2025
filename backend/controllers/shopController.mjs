//TODO: 
//1. Legge inn DEBUG_MODE i alle filer. 
//2. Rydde opp i statuskoder (skal komme fra en felles fil).
//3. Kan alle fetcher på backend samles i én fetch? 
//4. Vurdere å rydde opp i feilhåndtering (hvis tid).

import pool from "../config/dbConnect.mjs";
import fs from "fs/promises";
import { DEBUG_MODE } from "../config/debug.mjs";
import HTTP_CODES from "../utils/httpCodes.mjs";
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../data/shopProducts.json");

export async function getAllProducts(req, res) {
  try {
    const result = await pool.query("SELECT * FROM produkter");
    res.json(result.rows);
    // const products = await getFileData(filePath);
    // res.json(Object.values(products));
  } catch (error) {
    console.error("[ERROR shopController], Feil ved henting av produkter", error);
    res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Feil ved henting av produkter", error });
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

    const { produktnavn, sku, merke_id, kategori_id, farge_id, pigmenter, pris, lagerstatus, beskrivelse } = req.body;
     
    if (!produktnavn) return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: "Mangler påkrevde felt: Produktnavn" });
    if (!sku) return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: "Mangler påkrevde felt: SKU-nummer" });
    if (!pris) return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: "Mangler påkrevde felt: Pris" });
    

    const query = `
    INSERT INTO produkter (produktnavn, sku, merke_id, kategori_id, farge_id, pigmenter, pris, lagerstatus, beskrivelse)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
    `;
    // const products = await getFileData(filePath);

    if (!Array.isArray(pigmenter)) {
      pigmenter = pigmenter ? [pigmenter] : [];
  }

  const values = [produktnavn, merke_id, kategori_id, farge_id, pigmenter, pris, lagerstatus, beskrivelse, sku];
  const result = await pool.query(query, values);  


    res.status(201).json({
        message: `Produkt '${navn}' lagt til`,
        produkt: products[newId],
      });
  } catch (error) {
    console.error("[ERROR shopController] Feil ved lagring av produkt", error);
    res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Feil ved lagring av produkt", error: error.message });
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

    if (DEBUG_MODE) console.log(`[DEBUG shopController] Produkt med ID ${id} slettet.`);
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
    if (DEBUG_MODE) console.log("[DEBUG shopController] shopProducts.json er gjenopprettet med standarddata.");

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
