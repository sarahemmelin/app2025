import fs from "fs/promises";
const filePath = "./data/shopProducts.json";

export async function getAllProducts(req, res) {
    try {
        const fileData = await fs.readFile(filePath, "utf-8");
        const products = JSON.parse(fileData);
        res.json(Object.values(products));
    } catch (error) {
        res.status(500).json({ message: "Feil ved henting av produkter", error });
    }
}

export async function getProduct(req, res) {
    try {
        const fileData = await fs.readFile(filePath, "utf-8");
        const products = JSON.parse(fileData);
        const product = products[req.params.id];

        if (!product) return res.status(404).json({ message: "Produkt ikke funnet" });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error reading product", error });
    }
}

let nextId = 4;
export async function createProduct(req, res) {
    try {
        const {
            navn, 
            kategori, 
            pris,
            lager, 
            farge,
            pigment,
            beskrivelse,
            sku
            } = req.body;

            const fileData = await fs.readFile(filePath, "utf-8");
            const products = JSON.parse(fileData);

            const newId = String(nextId++);
            products[newId] = {
                navn,
                kategori,
                pris,
                lager,
                farge,
                pigment,
                beskrivelse,
                sku
            };

            if (pigment) produkter[newId].pigment = pigment;
            if (sku) produkter[newId].sku = sku;
            if (beskrivelse) produkter[newId].beskrivelse = beskrivelse;

        } catch (error) {
            res.status(500).json({ message: "Error creating product", error });
        }
    }
