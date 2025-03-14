# Illustrate.no – Nettbutikk PWA  
**Progressive Web App for produkter med API-integrasjon**  

![Illustrate.no](https://usercontent.one/wp/www.sarahemmelin.no/wp-content/uploads/2022/09/Bakgrunn-til-nettside-sorthvitt.webp) 

**Om prosjektet**  
Illustrate.no er en "nettbutikk" bygget som en **PWA (Progressive Web App)**, med fokus på produkter.
Prosjektet bruker en REST (isj) API-backend for håndtering av produkter, hvor API-et er utviklet i Node.js med Express, og data lagres i en PostgreSQL-database. Det er brukt PGAdmin som verktøy for å håndtere databasen og koble den opp mot serveren.  
Deploy er håndtert via Render og frontend er en SPA (Single Page Application) med Shadow DOM-komponenter.  

##**Live-versjon (PROD)
**[Illustrate.no – Hosted on Render](https://app2025.onrender.com)**  

## 📂 **Mappestruktur**
```plaintext
📦 demo25/
 ├── 📂 backend/
 │    ├── 📂 config/          # Konfigurasjonsfiler (DB, logger, miljøvariabler)
 │    ├── 📂 controllers/     # API-kontrollere
 │    ├── 📂 data/            # JSON-data (midlertidig)
 │    ├── 📂 middleware/      # Middleware
 │    ├── 📂 routes/          # APIer
 │    ├── 📂 utils/           # Globale hjelpefunksjoner
 │    ├── 📂 workers/         # Tiiiny helpers
 │    ├── server.mjs          # Serveren
 │
 ├── 📂 frontend/
 │    ├── 📂 components/      # Shadow DOM-komponenter
 │    ├── 📂 css/             # Styling for applikasjonen
 │    ├── 📂 icons/           # Ikoner for app
 │    ├── 📂 js/              # JavaScript-kode for frontend
 |        ├── 📂 api/                   # Api for frontend
 |        ├── 📂 config/                # Konfigurasjonsfil for klient
 |        ├── 📂 router/                # Routing for SPA
 |        ├── 📂 view-controllers/      # Controllere for Shadow DOM - klasser
 |        ├── app.mjs                   # Initiering av app
 |        ├── registerSW.mjs            # Registrering av Service Worker
 |
 │    ├── 📂 templates/           # Shadow DOM-komponenter
 │    ├── index.html              # Hovedside
 │    ├── manifest.webmanifest    # Webmanifest - filen
 │    ├── offline.html            # Offline - side
 │    ├── serviceWorker.js        # ServiceWorker
 │
 ├── 📂 postman/            # Adminklient sin API dokumentasjon
 ├── .env                   # Miljøvariabler (API-nøkler, DB-info) / Er ikke offentlig - du må lage din egen.
 ├── package.json           # Avhengigheter
 ├── README.md              # 📖 Du er her!


For å bruke API-et må du logge deg inn og få et token.
Brukernavn og passord er sendt til de respektive parter som skal ha tilgang til dette prosjektet. 


Forfatter:
Sarah Emmelin Johansen Schanke 
