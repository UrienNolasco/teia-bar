"use server";

import { db } from "@/lib/prisma";

interface GetProdutoNomeParams {
  produtoId: string;
}

export const getProdutoNome = async ({ produtoId }: GetProdutoNomeParams): Promise<string | null> => {
  try {
    const produto = await db.produto.findUnique({
      where: { id: produtoId },
      select: { nome: true }, // Busca apenas o nome
    });

    if (!produto) {
      throw new Error("Produto não encontrado");
    }

    return produto.nome;
  } catch (error) {
    console.error("Erro ao buscar o nome do produto:", error);
    throw new Error("Erro ao buscar o nome do produto");
  }
};
