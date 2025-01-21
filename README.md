**README - fil for å bruke prosjektet:**
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

========== Kortstokk ==================================

Stokker kortstokken med PATCH (Shuffle)
Google-søk på hvordan man shuffler key-value-par inne i et array returnerer 
en algoritme som heter Fisher-Yates shuffle. Denne algoritmen er en av de mest 
effektive måtene å shuffler et array på.
https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle

Eksempel 
        Dette kalles "destrukturering" for å bytte plass på to elementer i et array.
        Eksempel: 
        let array = [1, 2, 3, 4, 5];
        let i = 1; // Indeks 1 (verdi 2)
        let j = 3; // Indeks 3 (verdi 4)

        Bytte plass på elementene på indeks 1 og 3
        [array[i], array[j]] = [array[j], array[i]];

        console.log(array); // Output: [1, 4, 3, 2, 5]


Forfatter: Sarah
