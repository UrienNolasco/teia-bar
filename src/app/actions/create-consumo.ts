"use server";

import { db } from "@/lib/prisma";

interface CreateConsumoParams {
  usuarioId: string;
  produtoId: string;
  criadoEm: Date;
  quantidade: number;
  valorTotal: number;
}

export const createConsumo = async (params: CreateConsumoParams) => {
  const { produtoId, quantidade } = params;

  try {

    await db.$transaction(async (transaction) => {

      await transaction.consumo.create({
        data: params,
      });

      await transaction.consumoHistorico.create({
        data: params,
      })

      const produto = await transaction.produto.findUnique({
        where: { id: produtoId },
      });

      if (!produto) {
        throw new Error("Produto não encontrado.");
      }

      if (produto.quantidadeEstoque < quantidade) {
        throw new Error("Estoque insuficiente para realizar a compra.");
      }

      await transaction.produto.update({
        where: { id: produtoId },
        data: {
          quantidadeEstoque: produto.quantidadeEstoque - quantidade,
        },
      });
    });
  } catch (error) {
    console.error("Erro ao criar consumo e atualizar estoque:", error);
    throw error;
  }
};
