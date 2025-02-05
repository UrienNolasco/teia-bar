"use client";
/* eslint-disable react/react-in-jsx-scope */

import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import { useState } from "react";
import { toast } from "react-toastify";

import { useSession } from "next-auth/react";
import { isUserAdmin } from "@/app/actions/get-useradmin";
import { deletarConsumo } from "@/app/actions/delete-consumo";

const DeletarConsumo = () => {
  const {data: session} = useSession();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOnClickSave = async () => {
    try {
      await deletarConsumo();
      toast.success("Todos os consumos foram deletados com sucesso.");
    } catch (error) {
      console.error("Erro deletar consumos", error);
      toast.error("Erro a");
    }
  };

  const handleDialogOpen = async () => {
    try {
      if (!session || !session.user || !session.user.email) {
        toast.warning("Você precisa estar logado para acessar esta funcionalidade.");
        return;
      }
  
      const isAdmin = await isUserAdmin(session.user.email);
      if (!isAdmin) {
        toast.error("Apenas administradores podem cadastrar bebidas.");
        return;
      }

      setIsDialogOpen(true);
    } catch (error) {
      console.error("Erro ao verificar permissão do usuário:", error);
      toast.error("Erro ao verificar permissão.");
    }
  };
  
  

  return (
    <>
      <Button className=" gap-2 bg-red-600 h-10 w-10 " onClick={handleDialogOpen}>
        <Trash />
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
        <DialogContent className="w-[80%] rounded-2xl">
          <DialogTitle className="text-2xl">Deletar todos os consumos</DialogTitle>
            <p>
                Você tem certeza que deseja deletar todos os consumos?
            </p>
            <p>
                Apenas faça isso após ter lançado todos os consumos.
            </p>
            <p>
                Esta ação não pode ser desfeita.
            </p>
          <DialogFooter className="mt-2">
            <Button className="bg-red-600" onClick={handleOnClickSave}>DELETAR</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeletarConsumo;
