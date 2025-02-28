if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/serviceWorker.js")
        .then(() => console.log("✅ Service Worker registrert!"))
        .catch(error => console.error("❌ Service Worker-feil:", error));
}
