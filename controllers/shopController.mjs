import fs from "fs/promises";
const filePath = "./data/shopProducts.json";

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

        if (!product) return res.status(404).json({ message: "Produkt ikke funnet" });

        res.json(product);
    } catch (error) {
        console.log("Feil ved henting av produkter", error);
        res.status(500).json({ message: "Feil ved henting av produkter", error });
    }
}

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

            if (!navn || !kategori || !pris || !sku) {
                return res.status(400).json({ message: "Mangler påkrevde felt" });
            }

            
            const products = await getFileData(filePath);
            
            const existingIds = Object.keys(products);
            const idNumber = existingIds.map(id => Number(id));
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
                beskrivelse: beskrivelse || "Ingen beskrivelse"
            };

            await fs.writeFile(filePath, JSON.stringify(products, null, 2));
            res.status(201).json({ message: `Produkt '${navn}' lagt til`, produkt: products[newId] });

        } catch (error) {
            console.error("Feil ved lagring av produkt", error);
            res.status(500).json({ message: "Feil ved lagring av produkt", error: error.message });
        }
    }

export async function deleteProduct(req, res) {
    try {

        const { id } = req.params;

        const products = await getFileData(filePath);

        if (!products[id]) return res.status(404).json({ message: `Produkt med ID ${id} ikke funnet` });

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
        return JSON.parse(fileData);
    } catch (error) {
        console.error("Feil ved lesing av fil", error);
        return {
        };
    }
}