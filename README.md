**README - fil for å bruke prosjektet:**
______________________________________________________________
*Assignment 1:*
Åpne en terminal: 
Skriv: 
  cd '/din/lokale/rute/til/repoet' 
Bytt ut '/din/lokale/rute/til/repoet' med din lokale rute til repoet.

Kjør koden ved å skrive
  node script.mjs 

I dette programmet kjører vi programmet på port 3000. Du skal få en bekreftelse tilbake på at du kjører på denne porten.

Bruk Postman, nettleser eller terminal for å teste "serveren". 

**Postman og nettleser**
***Haiku:***
http://localhost:3000/tmp/poem/haiku

***Alliteration:***
http://localhost:3000/tmp/poem/alliteration

***Limerick:***
http://localhost:3000/tmp/poem/limerick

***Random Quote:***
http://localhost:3000/tmp/quote

***Tilfeldige statuskoder for test av importerte objekter***
http://localhost:3000/tmp/random-status

***Bruk Postman til å teste POST - ruten:***
http://localhost:3000/tmp/sum/3/8 (valgfrie tall på slutten) 

***Bruk konsollen i nettleseren for å teste POST opp mot serveren:***
Skriv da 
  fetch('http://localhost:3000/tmp/sum/3/8', {
      method: 'POST'
  })
  .then(response => response.text())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

***Bruk terminalen til å teste POST opp mot serveren:***
Kjør serveren med 
  node script.mjs
  
Åpne en ny terminal og skriv
  curl -X POST http://localhost:3000/tmp/sum/3/8

______________________________________________________________
*Assignment 2: Middleware* 
Middlewaren kjører av seg selv.
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