import Image from "next/image"
import { Card, CardContent } from "./ui/card"

import SideBarButton from "./sidebar-sheet"

const Header = () => {
  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-5">
        <Image src="/Logo-teia.avif" height={18} width={120} alt="TeiaBar" />
        <SideBarButton />
      </CardContent>
    </Card>
  )
}

export default Header
