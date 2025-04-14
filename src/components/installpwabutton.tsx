"use client"
/* eslint-disable react/react-in-jsx-scope */

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsVisible(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    const promptEvent = deferredPrompt as any
    promptEvent.prompt()

    const result = await promptEvent.userChoice
    if (result.outcome === "accepted") {
      console.log("Usuário aceitou instalar")
    } else {
      console.log("Usuário recusou instalar")
    }

    setIsVisible(false)
    setDeferredPrompt(null)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button onClick={handleInstallClick} className="shadow-lg">
        Instalar app
      </Button>
    </div>
  )
}
