"use server";

import { db } from "@/lib/prisma";

interface DeletarBebidaParams {
  id: string;
}

export const deletarBebida = async (params: DeletarBebidaParams) => {
  try {
    if (!params.id) {
      throw new Error("ID do produto é obrigatório");
    }

    await db.produto.delete({
      where: { id: params.id },
    });

  } catch (error) {
    console.error("Erro ao deletar bebida:", error);
  }
};
