"use client"

import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./ui/dialog";
import { CircleMinus } from "lucide-react";
import { Button } from "./ui/button";
import ProdutoItem from "./produto-item";
import { useEffect, useState } from "react";
import { getProdutos } from "@/app/actions/get-produto";

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
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProdutos = async () => {
            const data = await getProdutos();
            setProdutos(data);
            setLoading(false);
          };   
        fetchProdutos();
    }, []);
    
    return ( 
        <Dialog >
        <DialogTrigger asChild>
        <Button className="justify-start gap-2">
        <CircleMinus /> Remover Bebidas
      </Button>
        </DialogTrigger>
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
      </Dialog>
     );
}
 
export default RemoverBebidas;