import { CircleMinus, CirclePlus, LogInIcon, MenuIcon, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import Image from "next/image";

const SideBarButton = () => {
    return ( 
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
          <div className="flex items-center gap-3 border-b border-solid py-5 justify-between">  
            <h2 className="font-bold text-lg">Olá, faça seu login!</h2>
            <Dialog>
                <DialogTrigger asChild>
                    <Button size="icon">
                        <LogInIcon />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Faça login na plataforma</DialogTitle>
                        <DialogDescription>Conece-se usando sua conta do Google</DialogDescription>
                    </DialogHeader>
                    <Button  variant="outline" className="gap-1 font-bold">
                        <Image src="/google.svg" height={18} width={18} alt="Google" />
                        Google
                    </Button>
                </DialogContent>
            </Dialog>
          </div>
          {/* AVATAR
          <div className="flex items-center border-b border-solid py-5 gap-3">
            <Avatar>
              <AvatarImage src="public\vercel.svg" alt="Urien Nolasco">Urien Nolasco</AvatarImage>
            </Avatar>

            <div>
              <p className="font-bold">Urien Nolasco</p>
              <p className="text-sm">urien.dragon@gmail.com</p>
            </div>
          </div>  */}
          


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
     );
}
 
export default SideBarButton;