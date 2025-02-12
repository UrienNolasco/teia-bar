"use server";

import { db } from "@/lib/prisma";

interface AtualizarBebidaParams {
  id: string;
  nome?: string;
  descricao?: string;
  valor?: number;
  quantidadeEstoque?: number;
  imageUrl?: string;
}

export const atualizarBebida = async (params: AtualizarBebidaParams) => {
  try {
    if (!params.id) {
      throw new Error("ID do produto é obrigatório");
    }

    await db.produto.update({
      where: { id: params.id },
      data: {
        nome: params.nome,
        descricao: params.descricao,
        valor: params.valor,
        quantidadeEstoque: params.quantidadeEstoque,
        imageUrl: params.imageUrl,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar bebida:", error);
  }
};
