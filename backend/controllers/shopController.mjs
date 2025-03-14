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
      return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ message: "Produkt ikke funnet" });

    res.json(product);
    
  } catch (error) {
    console.error("[ERROR], Feil ved henting av produkter", error);
    res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Feil ved henting av produkter", error });
  }
}

export async function createProduct(req, res) {
  try {

    let { produktnavn, sku, merke_id, kategori_id, farge_id, pigmenter, pris, lager, lagerstatus, beskrivelse } = req.body;
     
    if (!produktnavn) return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: "Mangler påkrevde felt: Produktnavn" });
    if (!sku) return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: "Mangler påkrevde felt: SKU-nummer" });
    if (!pris) return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: "Mangler påkrevde felt: Pris" });


    if (!lagerstatus) {
      lagerstatus = (lager && parseInt(lager) > 0) ? 1 : 0;
    }
    
    const skuCheckQuery = `SELECT * FROM public.produkter WHERE sku = $1`;
    const skuCheckResult = await pool.query(skuCheckQuery, [sku]);

    if (skuCheckResult.rows.length > 0) {
      return res.status(HTTP_CODES.CLIENT_ERROR.CONFLICT).json({ message: `SKU '${sku}' er allerede i bruk.` });
    }

    if (!Array.isArray(pigmenter)) {
        pigmenter = pigmenter ? [pigmenter] : [];
    }

    const query = `
    INSERT INTO public.produkter (produktnavn, sku, merke_id, kategori_id, farge_id, pigmenter, pris, lagerstatus, beskrivelse)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
    `;
   
  const values = [produktnavn, sku, merke_id, kategori_id, farge_id, pigmenter, pris, lagerstatus, beskrivelse];
  const result = await pool.query(query, values);  

    res.status(HTTP_CODES.SUCCESS.CREATED).json({
        message: `Produkt '${produktnavn}' lagt til`,
        produkt: result.rows[0],
      });
  } catch (error) {
    console.error("[ERROR shopController] Feil ved lagring av produkt", error);
    res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Feil ved lagring av produkt", error: error.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { produktnavn, sku, pris, beskrivelse, lager } = req.body;

    if (!produktnavn && !sku && !pris && !beskrivelse && !lager) {
      return res.status(400).json({ message: "Ingen felt sendt for oppdatering." });
    }

    let fields = [];
    let values = [];
    let index = 1;

    if (produktnavn) {
      fields.push(`produktnavn = $${index}`);
      values.push(produktnavn);
      index++;
    }
    if (sku) {
      fields.push(`sku = $${index}`);
      values.push(sku);
      index++;
    }
    if (pris) {
      fields.push(`pris = $${index}`);
      values.push(pris);
      index++;
    }
    if (beskrivelse) {
      fields.push(`beskrivelse = $${index}`);
      values.push(beskrivelse);
      index++;
    }
    if (lager) {
      fields.push(`lagerstatus = $${index}`);
      values.push(parseInt(lager) > 0 ? 1 : 0);
      index++;
    }

    values.push(id);

    const updateQuery = `
      UPDATE public.produkter
      SET ${fields.join(", ")}, oppdatert = NOW()
      WHERE id = $${index}
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Produkt ikke funnet" });
    }

    res.json({
      message: "Produkt oppdatert",
      produkt: result.rows[0]
    });

  } catch (error) {
    console.error("[ERROR shopController] Feil ved oppdatering av produkt", error);
    res.status(500).json({ message: "Feil ved oppdatering av produkt", error: error.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const productResult = await pool.query("SELECT * FROM produkter WHERE id = $1", [id]);
    if (productResult.rows.length === 0) {
      return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ message: `Produkt med ID ${id} ikke funnet` });
    }

    const deleteQuery = "DELETE FROM produkter WHERE id = $1 RETURNING *";
    const deleteResult = await pool.query(deleteQuery, [id]);
    res.json({ message: `Produkt med ID ${id} slettet`, produkt: deleteResult.rows[0] });
  } catch (error) {
    console.error("[ERROR shopController] Feil ved sletting av produkt", error);
    res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Feil ved sletting av produkt", error: error.message });
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
