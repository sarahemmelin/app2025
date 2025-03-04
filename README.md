#README - fil for å bruke prosjektet:
______________________________________________________________
##Regler for prosjektet: 
**Konsollen skal brukes slik:**
console.error skal gi "[ERROR] beskjed, error"
console.log skal gi "[DEBUG] beskjed, data.data"
console.warn skal gi "[WARN] beskjed, data"

______________________________________________________________

*Assignment 3: Datastrukturer og ekstern server*
PROD-versjon (Render):

URL: https://app2025.onrender.com

**Bruk av API-et**

***GET-endepunkter***

Hent alle produkter:
GET http://localhost:3000/shop/

Hent et spesifikt produkt:
GET http://localhost:3000/shop/:id

***POST-endepunkt (krever API-nøkkel)***
Legg til et nytt produkt:
POST http://localhost:3000/shop/

Headers:
x-api-key: your-api-key-here
Content-Type: application/json

Body:
{
  "navn": "Test Produkt",
  "kategori": ["Maling"],
  "pris": 99.9,
  "lager": 10,
  "farge": "Grønn",
  "pigment": "PG7",
  "beskrivelse": "En test av API-nøkkelvalidering",
  "sku": "TEST-SKU"
}

***DELETE-endepunkt (krever API-nøkkel)***
Slett et produkt:
DELETE http://localhost:3000/shop/:id

Headers:
x-api-key: your-api-key-here

______________________________________________________________