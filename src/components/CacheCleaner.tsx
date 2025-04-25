"use client"

import { useEffect } from "react"

export function CacheCleaner() {
  useEffect(() => {
    // Verifica se está no navegador
    if (typeof window !== "undefined") {
      // Adiciona um listener para erros de carregamento de recursos
      window.addEventListener(
        "error",
        (e) => {
          // Verifica se o erro é de um recurso que falhou ao carregar
          if (e.target && (e.target as HTMLElement).tagName) {
            const target = e.target as HTMLElement
            if (target.tagName === "LINK" || target.tagName === "SCRIPT") {
              console.log("Recurso falhou ao carregar, recarregando página...")
              // Recarrega a página se um recurso falhar
              window.location.reload()
            }
          }
        },
        true,
      )

      // Tenta limpar o cache se disponível
      if ("caches" in window) {
        console.log("Limpando caches do navegador...")
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName).then(() => {
              console.log(`Cache ${cacheName} deletado`)
            })
          })
        })
      }
    }
  }, [])

  return null
}
