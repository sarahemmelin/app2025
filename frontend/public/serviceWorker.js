const cacheID = "Nettbutikken.no-v1";
const contentToCache = [
  "/",
  "/index.html",
  "/offline.html",
  "/js/app.mjs",
  "/icons/small.png",
  "/icons/large.png",
  "/css/style.css",
  "/templates/addProductForm.html",
  "/templates/adminView.html",
  "/templates/login.html",
  "/templates/productCard.html",
  "/templates/productCardEdit.html",
];

self.addEventListener("install", async (e) => {
  console.log("[Service Worker] Installerer");
  self.skipWaiting();

  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheID);
      console.log(
        "[Service Worker] Lagrer alt i cache: app-skallet og innholdet"
      );

      try {
        for (const file of contentToCache) {
          console.log(`[Service Worker] Prøver å cache: ${file}`);
          const response = await fetch(file);
          if (!response.ok)
            throw new Error(
              `Feil med ${file}: ${response.status} ${response.statusText}`
            );
        }
        await cache.addAll(contentToCache);
        console.log(
          "[Service Worker] Følgende filer ble cachet:",
          contentToCache
        );
      } catch (error) {
        console.error("[Service Worker] Feil under caching:", error);
      }
    })()
  );
});
self.addEventListener("activate", async (e) => {
  console.log("[Service Worker] Rydder opp gamle cacher...");
  e.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== cacheID)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", async (e) => {
  if (e.request.url.includes("/shop/")) {
    console.log(`[Service Worker] Henter API direkte: ${e.request.url}`);
    return;
  }
  e.respondWith(
    (async () => {
      console.log(`[Service Worker] Behandler forespørsel: ${e.request.url}`);

      try {
        const response = await fetch(e.request);
        return response;
      } catch (error) {
        console.log(`[Service Worker] Nettverksfeil!`);

        if (e.request.destination === "document") {
          console.log("[Service Worker] Viser offline.html!");
          return await caches.match("/offline.html");
        }

        return new Response(
          "Du er offline, og denne ressursen er ikke cachet.",
          {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          }
        );
      }
    })()
  );
});
