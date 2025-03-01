const cacheID = "Nettbutikken.no-v1";
const contentToCache = [
    "/",
    "/index.html",
    "/offline.html",
    "/js/app.mjs",
    // "/icons/small.png",
    // "/icons/large.png",
    "/css/style.css"
];
// await cache.addAll(contentToCache);
self.addEventListener("install", async (e) => {
    console.log("[Service Worker] Installerer");
    e.waitUntil((async () => {
        const cache = await caches.open(cacheID);
        console.log("[Service Worker] Lagrer alt i cache: app-skallet og innholdet");

        try {
            for (const file of contentToCache) {
                console.log(`[Service Worker] Prøver å cache: ${file}`);
                const response = await fetch(file);
                if (!response.ok) throw new Error(`Feil med ${file}: ${response.status} ${response.statusText}`);
            }
            await cache.addAll(contentToCache);
            console.log("[Service Worker] Følgende filer ble cachet:", contentToCache);
        } catch (error) {
            console.error("[Service Worker] Feil under caching:", error);
        }
    })());
});
self.addEventListener("activate", async (e) => {
    console.log("[Service Worker] Rydder opp gamle cacher...");
    e.waitUntil((async () => {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames
                .filter((name) => name !== cacheID)
                .map((name) => caches.delete(name))
        );
    })());
});

self.addEventListener("fetch", async (e) => {
    if (!e.request.url.startsWith("http")) return; 

    e.respondWith((async () => {
        console.log(`[Service Worker] Behandler forespørsel: ${e.request.url}`);

        const cachedResponse = await caches.match(e.request);
        if (cachedResponse) {
            console.log(`[Service Worker] Returnerer cachet versjon: ${e.request.url}`);
            return cachedResponse;
        }

        try {
            console.log(`[Service Worker] Ikke cachet, prøver å hente fra nett: ${e.request.url}`);
            const response = await fetch(e.request);
            
            console.log(`[Service Worker] Lagrer i cache: ${e.request.url}`);
            const responseClone = response.clone();
            const cache = await caches.open(cacheID);
            await cache.put(e.request, responseClone);

            return response;
        } catch (error) {
            console.log(`[Service Worker] Nettverksfeil! Viser offline.html for: ${e.request.url}`);
            return await caches.match("/offline.html");
        }
    })());
});