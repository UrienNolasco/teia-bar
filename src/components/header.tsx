'use client'

/* eslint-disable react/react-in-jsx-scope */

import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { usePathname } from "next/navigation"

import SideBarButton from "./sidebar-sheet"
import Link from "next/link"
import DeletarConsumo from "./deletarconsumo"

const Header = () => {
  const pathname = usePathname() 
  const isConsumeManagementPage = pathname === "/consumeManagement"

  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-5">
        <Link href="/"> 
          <Image src="/Logo-teia.avif" height={18} width={120} alt="TeiaBar" />
        </Link>
        {isConsumeManagementPage && <DeletarConsumo />}
        <SideBarButton />
      </CardContent>
    </Card>
  )
}

export default Header