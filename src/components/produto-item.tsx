"use client";

import { Produto } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { CircleDollarSign} from "lucide-react";
import { Badge } from "./ui/badge";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { createConsumo } from "@/app/actions/create-consumo";


interface ProdutoItemProp{

    produto: {

        id: string;

        nome: string;

        descricao: string | null;

        valor: number;

        quantidadeEstoque: number;

        criadoEm: Date;

        imageUrl: string | null;

    }

}



const ProdutoItem = ({produto}:ProdutoItemProp) => {
    const {data: session} = useSession();
    const { data } = useSession();

    const quantidade = 1;

    const handleCreateConsumo = async () => {
        try{
            if(!session){
                toast.warning("Você precisa estar logado para realizar uma compra.");
                return;
            }
            await createConsumo({
                produtoId: produto.id,
                usuarioId: (data?.user as any).id, 
                criadoEm: new Date(),
                quantidade: quantidade,
                valorTotal: Number(produto.valor) * quantidade
            })
            toast.success("Compra realizada com sucesso");
        }catch(error){
            console.error(error);
            toast.error("Erro ao realizar compra");
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
                              {Number(produto.valor)}
                        </p>
                    </Badge>
                </div>

                {/* TEXTO */}
                <div className=" py-3 text-center">
                    <h3 className="font-semibold truncate ">{produto.nome}</h3>
                    <p className="text-xs text-gray-400 truncate"> {produto.descricao} </p>
                    <Button variant="secondary" className="w-full mt-3" onClick={handleCreateConsumo}>
                        Comprar
                    </Button>
                </div>
            </CardContent>
        </Card>
     );
}

export default ProdutoItem;