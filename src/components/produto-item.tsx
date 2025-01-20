"use client";

import { Produto } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { CircleDollarSign} from "lucide-react";
import { Badge } from "./ui/badge";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface ProdutoItemProp{
    produto: Produto
}


const ProdutoItem = ({produto}:ProdutoItemProp) => {

    const {data: session} = useSession();

    const handleComprar = async () => {
        if(!session){
            alert('Você precisa estar logado para comprar');
            return;
        }
        try {
            const response = await fetch("/api/compra", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                produtoId: produto.id,
                quantidade: 1, // ou a quantidade escolhida
              }),
            });
      
            if (response.ok) {
              toast.success("Compra realizada com sucesso!");
            } else {
              const errorData = await response.json();
              toast.error(`Erro ao realizar a compra: ${errorData.message}`);
            }
          } catch (error) {
            toast.error("Ocorreu um erro inesperado. Tente novamente.");
          }
    };

    return ( 
        <Card className="min-w-[159px] rounded-2xl">
            <CardContent className="p-0 px-2 pt-2">
                {/* IMAGEM */}
                <div className="relative h-[159px] w-full" >
                    <Image className="object-contain rounded-2xl" fill layout="fill" src={produto.imageUrl ?? '/default-image.png'} alt={produto.nome}/>
                    <Badge  className="absolute left-2 top-2 space-x-1">
                        <CircleDollarSign size={17}  />
                        <p className="text-xs font-semibold">
                              {produto.valor.toString()}
                        </p>
                    </Badge>
                </div>

                {/* TEXTO */}
                <div className=" py-3 text-center">
                    <h3 className="font-semibold truncate ">{produto.nome}</h3>
                    <p className="text-xs text-gray-400 truncate"> {produto.descricao} </p>
                    <Button variant="secondary" className="w-full mt-3" onClick={handleComprar}>
                        Comprar
                    </Button>
                </div>
            </CardContent>
        </Card>
     );
}

export default ProdutoItem;