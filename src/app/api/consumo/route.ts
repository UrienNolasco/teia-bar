import { db } from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const consumo = await db.consumo.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
        produto: {
          select: {
            nome: true,
            descricao: true,
            valor: true,
          },
        },
      },
    })
    return NextResponse.json(consumo)
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar consumos" },
      { status: 500 },
    )
  }
}
