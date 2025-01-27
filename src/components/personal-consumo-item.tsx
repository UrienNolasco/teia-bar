"use client";
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { getProdutoNome } from "@/app/actions/get-produtoname";
import { useSession } from "next-auth/react";

interface ConsumoItemProp {
  consumo: {
    id: string;
    valorTotal: number;
    quantidade: number;
    criadoEm: Date;
    usuarioId: string;
    produtoId: string;
  };
}

const ConsumoPessoalItem = ({ consumo }: ConsumoItemProp) => {
  const { data: session } = useSession();
  const [produtoNome, setProdutoNome] = useState<string | null>(null);

  useEffect(() => {
    const fetchProdutoNome = async () => {
      try {
        const nome = await getProdutoNome({ produtoId: consumo.produtoId });
        setProdutoNome(nome);
      } catch (error) {
        setProdutoNome("Erro ao buscar produto");
      }
    };
    fetchProdutoNome();
  }, [consumo.produtoId]);


  if (!session || session.user?.id !== consumo.usuarioId) {
    return null; 
  }

  return (
    <Card className="min-w-[200px] rounded-2xl">
      <CardContent className="p-0 px-2 pt-2">
        <div className="relative h-[170px] w-full">
          <p className="font-semibold">O que consumiu:</p>
          <p>{produtoNome}</p>
          <p className="mt-2 font-semibold">Quando Consumiu:</p>
          <p>{consumo.criadoEm.toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsumoPessoalItem;