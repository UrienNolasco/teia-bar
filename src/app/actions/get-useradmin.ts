"use server";

import { db } from "@/lib/prisma";

export const isUserAdmin = async (email: string): Promise<boolean> => {
  try {
    // Busca o usuário no banco de dados pelo e-mail fornecido
    const user = await db.user.findUnique({
      where: { email },
      select: { tipo: true }, // Certifique-se de que "tipo" é o campo correto no banco de dados
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Retorna se o usuário é administrador
    return user.tipo === "ADMIN";
  } catch (error) {
    console.error("Erro ao verificar o papel do usuário:", error);
    throw new Error("Erro ao verificar o papel do usuário");
  }
};
