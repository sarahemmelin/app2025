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


*Assignment: Middleware* 
**Middleware for sortering av produkter i en nettbutikk.**
Middlewaren skal håndtere filtrering av data før routeren håndterer det - er iallefall tanken.

Alternativ 2: 
**Middleware for filtrering av ondsinnet trafikk mot serveren.**
Middlewaren skal filtrere ut ondsinnet trafikk mot serveren. 
1. Research.
2. Filstruktur.
3. Hva starter vi med? 
  - Middleware-filen, la oss kalle den "vanguard.mjs"
  - 
4. 