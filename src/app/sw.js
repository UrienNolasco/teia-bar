import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

precacheAndRoute(self.__WB_MANIFEST || []);

// Cache de requisições (exemplo: APIs e assets)
registerRoute(
  ({ request }) => request.destination === "image",
  new StaleWhileRevalidate()
);

self.addEventListener("install", () => {
  console.log("Service Worker instalado!");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("Service Worker ativado!");
});
