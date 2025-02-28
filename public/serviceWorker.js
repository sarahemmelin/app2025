const cacheID = "Nettbutikken.no-v1";
const contentToCache = [
    "/",
    "/index.html",
    "/offline.html",
    "/app.mjs",
    // "/icons/small.png",
    // "/icons/large.png",
    "/css/style.css"
];

self.addEventListener("install", async (e) => {
    console.log("[Service Worker] Installerer");
    e.waitUntil((async () => {
        const cache = await caches.open(cacheID);
        console.log('[Service Worker] Lagrer alt i cache: app-skallet og innholdet');
        await cache.addAll(contentToCache);
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
        const cachedResponse = await caches.match(e.request);
        if (cachedResponse) return cachedResponse;

        try {
            const response = await fetch(e.request);
            if (!response || response.status !== 200 || response.type !== "basic") {
                return response;
            }

            const responseClone = response.clone();
            const cache = await caches.open(cacheID);
            await cache.put(e.request, responseClone);

            return response;
        } catch (error) {
            return await caches.match("/offline.html");
        }
    })());
});