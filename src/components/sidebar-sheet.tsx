"use client";

import { CircleMinus, CirclePlus, LogInIcon, LucideLogOut, MenuIcon, PackageOpen, PackageOpenIcon, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const SideBarButton = () => {
  const { data } = useSession();
  const handleLogout = () => signOut();
  const handleLoginWithGoogle = () => signIn("google");


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex items-center gap-3 border-b border-solid py-5 justify-between">
          {data?.user ? (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={data?.user?.image ?? ""} />
              </Avatar>
              <div>
                <p className="font-bold">{data.user.name}</p>
                <p className="text-xs">{data.user.email}</p>
              </div>
            </div>
          ) : (
            <>
              <h2 className="font-bold text-lg">Olá, faça seu login!</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon">
                    <LogInIcon />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[80%]">
                  <DialogHeader>
                    <DialogTitle>Faça login na plataforma</DialogTitle>
                    <DialogDescription>Conece-se usando sua conta do Google</DialogDescription>
                  </DialogHeader>
                  <Button variant="outline" className="gap-1 font-bold" onClick={handleLoginWithGoogle}>
                    <Image src="/google.svg" height={18} width={18} alt="Google" />
                    Google
                  </Button>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        {/*BOTOES*/}
        <div className="p-5 flex flex-col gap-4 border-b border-solid">


            {/* Cadastrar Bebida */}
          <Dialog>
            <DialogTrigger asChild>
            <Button className="justify-start gap-2">
              <CirclePlus /> Adicionar Bebidas
            </Button>
            </DialogTrigger>
            <DialogContent className="w-[90%]">
              <DialogTitle className="text-2xl">Cadastrar Bebida</DialogTitle>
                <div className="grid gap-4 py-2">
                  <div className="grid grid-cols-4 gap-10 items-center">
                    <Label className="text-base" htmlFor="nome">Bebida</Label>
                    <Input id="nome" className="col-span-3 text-sm py-1 px-2" defaultValue="Nome da Bebida" />
                  </div>
                </div>
                <div className="grid gap-6 py-2">
                  <div className="grid grid-cols-4 gap-10 items-center">
                    <Label className="text-base" htmlFor="desc">Descrição</Label>
                    <Input id="desc" className="col-span-3 text-sm px-2" defaultValue="Long Neck, 350ml, 250ml" />
                  </div>
                </div>
                <div className="grid gap-4 py-2">
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <Label className="text-base" htmlFor="valor">Valor</Label>
                    <Input id="valor" className="col-span-3 text-sm py-1 px-2" defaultValue="Valor" />
                  </div>
                </div>
                <div className="grid gap-4 py-w ">
                  <div className="grid grid-cols-4 gap-24 items-center ">
                    <Label className="text-base"  htmlFor="quantidade">Quantidade</Label>
                    <Input id="quantidade" className="col-span-3 text-sm py-1 px-2 " defaultValue="Quantidade" />
                  </div>
                </div>
              <DialogFooter className="mt-2">
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

            {/* Remover Bebida */}
          <Dialog>
            <DialogTrigger asChild>
            <Button className="justify-start gap-2">
            <CircleMinus /> Remover Bebidas
          </Button>
            </DialogTrigger>
            <DialogContent className="w-[80%]">
              <DialogTitle>Remover Bebidas</DialogTitle>
              
            </DialogContent>
          </Dialog>
          

            {/* Alterar Bebida */}
            <Dialog>
            <DialogTrigger asChild>
            <Button className="justify-start gap-2">
            <Settings /> Alterar Bebidas
          </Button>
            </DialogTrigger>
            <DialogContent className="w-[80%]">
              <DialogTitle>Alterar Bebidas</DialogTitle>
              <DialogHeader>

              </DialogHeader>
            </DialogContent>
          </Dialog>



        </div>


          {/*CONSUMO*/}
        <div className="p-5 flex flex-col gap-4 border-b border-solid">
          <Link href="/consumeManagement">
            <Button className="justify-start gap-2">
              <PackageOpen /> Ver Consumo
            </Button>
          </Link>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <Button variant="secondary" className="justify-start gap-2 fixed bottom-10" onClick={handleLogout}>
            <LucideLogOut /> Sair da conta
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideBarButton;