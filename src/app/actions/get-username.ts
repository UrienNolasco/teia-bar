"use server";

import { db } from "@/lib/prisma";

interface GetUserNameParams {
  usuarioId: string;
}

export const getUserName = async ({ usuarioId }: GetUserNameParams): Promise<string | null> => {
  try {
    const user = await db.user.findUnique({
      where: { id: usuarioId },
      select: { name: true }, // Busca apenas o nome
    });

    if (!user) {
      throw new Error("Nome não encontrado");
    }

    return user.name;
  } catch (error) {
    console.error("Erro ao buscar o nome do usuario:", error);
    throw new Error("Erro ao buscar o nome do usuario");
  }
};
