"use server";

import { db } from "@/lib/prisma";


interface CadastrarBebidaParams {
  nome: string;
  descricao: string;
  valor: number;
  quantidadeEstoque: number;
  imageUrl?: string;
}

export const cadastrarBebida = async (params: CadastrarBebidaParams) => {
  try {

    if (!params.nome || !params.descricao || !params.valor || !params.quantidadeEstoque) {
      throw new Error("Preencha todos os campos");
    }


    await db.produto.create({
      data: params,
    });

  } catch (error) {
    console.error("Erro ao cadastrar bebida:", error);

  }
};
