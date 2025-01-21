"use server";

import { db } from "@/lib/prisma";
import { toast } from "react-toastify";


interface CadastrarBebidaParams {
  nome: string;
  descricao: string;
  valor: number;
  quantidadeEstoque: number;
}

export const cadastrarBebida = async (params: CadastrarBebidaParams) => {
  try {

    if (!params.nome || !params.descricao || !params.valor || !params.quantidadeEstoque) {
      throw new Error("Preencha todos os campos");
    }


    await db.produto.create({
      data: params,
    });

    toast.success("Bebida cadastrada com sucesso");
  } catch (error) {
    console.error("Erro ao cadastrar bebida:", error);
    toast.error("Erro ao cadastrar bebida");
  }
};
