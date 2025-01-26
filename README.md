**README - fil for å bruke prosjektet:**
Ignorer for nå, denne filen må skrives om.

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

Forfatter: Sarah

*Assignment 2*
**Prosjektet er strukturert slik:**
(per 26.01.2025)
demo25/
│-- controllers/
│-- routes/
│-- public/
│   ├── css/
│   │   └── styles.css       
│   ├── js/
│   │   ├── api.js           # Kommunikasjon med serveren (API-kall)
│   │   ├── ui.js            # Håndtering av brukergrensesnittet
│   │   ├── app.js           # Hovedlogikken til klienten
│   ├── index.html           # Hovedsiden
│-- script.mjs
│-- package.json


Serversiden er bygget opp med .mjs og klienten benytter .js. 

**Grunner til bruk av .mjs på serveren:**
- ES-moduler er standardisert:
Node.js støtter både CommonJS (require) og ESM (import/export).
.mjs gjør det tydelig at filen bruker ES-moduler.
- Backward compatibility:
Mange gamle prosjekter bruker fortsatt CommonJS (.js).
For å unngå konflikter, anbefaler Node .mjs for ESM-filer.
- Konfigurasjon via package.json:
Hvis man vil bruke .js med ESM i Node.js, må man angi "type": "module" i package.json.
Hvis ikke, vil .js standardisere til CommonJS.

**Grunner til å bruke .js på klientsiden:**
- Standard praksis:
Nettlesere støtter ES-moduler i .js-filer uten problemer.
- Forenklet håndtering:
De fleste frontend-rammeverk og verktøy (React, Vue, etc.) forventer .js-filer.
- Bredere kompatibilitet:
Enkelte eldre nettlesere forstår kanskje ikke .mjs, mens .js er universelt akseptert.
Bedre integrasjon med byggverktøy:

Verktøy som Webpack, Vite og Parcel håndterer .js-filer sømløst uten spesialkonfigurasjon.


