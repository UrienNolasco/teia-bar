"use server"

import { db } from "@/lib/prisma"

interface CreateConsumoParams {
    usuarioId: string,
    produtoId: string,
    criadoEm: Date,
    quantidade: number,
    valorTotal: number
}

export const createConsumo = async (params: CreateConsumoParams) => {
    await db.consumo.create({
        data: params,
    })
    console.log(params);
}