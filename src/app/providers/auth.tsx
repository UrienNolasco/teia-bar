"use client"
/* eslint-disable react/react-in-jsx-scope */


import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

const AuthProvider = ({ children }: { children: ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default AuthProvider
