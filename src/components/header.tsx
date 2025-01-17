import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { CircleMinus, CirclePlus, MenuIcon, Settings } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Avatar, AvatarImage } from "./ui/avatar"

const Header = () => {
  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-5">
        <Image src="/Logo-teia.avif" height={18} width={120} alt="TeiaBar" />
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
             <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-left">
                Menu
              </SheetTitle>
            </SheetHeader>
            {/*AVATAR*/}
            <div className="flex items-center border-b border-solid py-5 gap-3">
              <Avatar>
                <AvatarImage src="public\vercel.svg" alt="Urien Nolasco">Urien Nolasco</AvatarImage>
              </Avatar>

              <div>
                <p className="font-bold">Urien Nolasco</p>
                <p className="text-sm">urien.dragon@gmail.com</p>
              </div>
            </div> 
            


            {/*BOTOES*/}
            <div className="p-5 flex flex-col gap-4 border-b border-solid" >
              <Button className="justify-start gap-2"> <CirclePlus/> Adicionar Bebidas</Button>
              <Button className="justify-start gap-2"> <CircleMinus/> Remover Bebidas</Button>
              <Button className="justify-start gap-2"> <Settings/> Alterar Bebidas</Button>
            </div >

            <div className="p-5 flex flex-col gap-4">
              <Button variant="secondary" className="justify-start gap-2 fixed bottom-10 "> <Settings/> Sair da conta</Button>
            </div>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  )
}

export default Header
