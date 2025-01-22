"use server"

import { db } from "@/lib/prisma";

export const getProdutos = async () => {
    try {
        const produtos = await db.produto.findMany();
        return produtos.map((produto) => ({
            ...produto,
            valor: produto.valor.toNumber(), 
        })) || [];
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        return [];
    }
};
