"use client";
/* eslint-disable react/react-in-jsx-scope */

import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { CircleMinus } from "lucide-react";
import { Button } from "./ui/button";
import ProdutoItem from "./produto-item";
import { useEffect, useState } from "react";
import { getProdutos } from "@/app/actions/get-produto";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface Produto {
  id: string;
  nome: string;
  descricao: string | null;
  valor: number;
  quantidadeEstoque: number;
  criadoEm: Date;
  imageUrl: string | null;
}

const RemoverBebidas = () => {
  const { data: session } = useSession();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProdutos = async () => {
      const data = await getProdutos();
      setProdutos(data);
      setLoading(false);
    };
    fetchProdutos();
  }, []);

  const handleDialogOpen = () => {
    if (!session?.user) {
      toast.warning("Você precisa estar logado para remover uma bebida.");
      return;
    }
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button className="justify-start gap-2" onClick={handleDialogOpen}>
        <CircleMinus /> Remover Bebidas
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
        {isDialogOpen && (
          <DialogContent className="w-[80%] max-h-[90%] overflow-y-auto [&::-webkit-scrollbar]:hidden rounded-2xl">
            <DialogTitle>Remover Bebidas</DialogTitle>
            <div className="flex flex-col gap-5">
              {loading ? (
                <p>Carregando...</p>
              ) : produtos.length > 0 ? (
                produtos.map((produto) => (
                  <ProdutoItem key={produto.id} produto={produto} isRemoving={true} />
                ))
              ) : (
                <p>Nenhum produto encontrado.</p>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default RemoverBebidas;
