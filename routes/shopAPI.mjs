import express from "express";
import { authenticateAPIKey } from "../modules/auth.mjs";
import { getAllProducts, getProduct, createProduct, deleteProduct } from "../controllers/shopController.mjs";
import { vanguard } from "../modules/vanguard.mjs"; 

const router = express.Router();

router.get("/", getAllProducts);
router.get("/products", getAllProducts);
router.get("/product-metadata", (req, res) => {
  const metadata = {
    produktStruktur: {
      generell: ["id", "sku", "navn", "kategori", "pris", "lager", "beskrivelse"],
      maling: ["farge", "pigmenter"]
      // Tanke: Bruke kategori som custom - egenskaper til spesifikke produktgrupper. Eksempel: papir: ["papirtype", "gramvekt"]
    }
  };
  res.json(metadata);
});
router.get("/:id", getProduct);


router.post("/", (req, res, next) => {
    if (vanguard.skills[0].use(req, res)) next();
  }, authenticateAPIKey, createProduct);
router.delete("/:id", authenticateAPIKey, deleteProduct);

export default router;