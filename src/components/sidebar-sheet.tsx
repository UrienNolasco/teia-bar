"use client";
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */


import { LogInIcon, LucideLogOut, MenuIcon, PackageOpen,  Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import CadastrarBebida from "./cadastrarbebida";
import RemoverBebidas from "./deletebebidas";
import { toast } from "react-toastify";
import { isUserAdmin } from "@/app/actions/get-useradmin";

const SideBarButton = () => {
  const { data } = useSession();
  const handleLogout = () => signOut();
  const handleLoginWithGoogle = () => signIn("google");


  const handleConsumeAccess = async () => {
    try {
      if (!data || !data.user || !data.user.email) {
        toast.warning("Você precisa estar logado para acessar esta funcionalidade.");
        return;
      }

      const isAdmin = await isUserAdmin(data.user.email);
      if (!isAdmin) {
        toast.error("Apenas administradores podem acessar a parte de consumo.");
        return;
      }

      window.location.href = "/consumeManagement";
    } catch (error) {
      console.error("Erro ao verificar permissão do usuário:", error);
      toast.error("Erro ao verificar permissão.");
    }
  };

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
          <CadastrarBebida />
          
            {/* Remover Bebida */}
          <RemoverBebidas />
          

            {/* Alterar Bebida */}
            <Dialog>
            <DialogTrigger asChild>
            <Button className="justify-start gap-2">
            <Settings /> Alterar Bebidas
          </Button>
            </DialogTrigger>
            <DialogContent className="w-[80%]">
              <DialogTitle>Alterar Bebidas</DialogTitle>
                Em implementação
            </DialogContent>
          </Dialog>



        </div>


          {/*CONSUMO*/}
        <div className="p-5 flex flex-col gap-4 border-b border-solid">
            <Button className="justify-start gap-2" onClick={handleConsumeAccess}>
              <PackageOpen /> Ver Consumo
            </Button>
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