/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { isUserAdmin } from "@/app/actions/get-useradmin"
import { db } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// Definindo interfaces para tipagem
interface ConsumoData {
  periodo: string
  nome: string
  produto: string
  quantidade: number
  valorUnitario: number
  valorTotal: number
  statusPagamento: string
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    console.log("API chamada")
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se é admin usando a função existente
    const isAdmin = await isUserAdmin(session.user.email)

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Apenas administradores podem exportar dados" },
        { status: 403 },
      )
    }

    // Obter o primeiro e último dia do mês anterior
    const today = new Date()
    const firstDayPrevMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1,
    )
    const lastDayPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0)

    // Formatar para ISO string para comparação no banco
    firstDayPrevMonth.setHours(0, 0, 0, 0)
    lastDayPrevMonth.setHours(23, 59, 59, 999)

    console.log(
      `Buscando consumos de ${firstDayPrevMonth.toISOString()} até ${lastDayPrevMonth.toISOString()}`,
    )

    // Buscar consumos do mês anterior da tabela ConsumoHistorico
    const consumos = await db.consumoHistorico.findMany({
      where: {
        criadoEm: {
          gte: firstDayPrevMonth,
          lte: lastDayPrevMonth,
        },
      },
      include: {
        produto: {
          select: {
            nome: true,
            valor: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        criadoEm: "asc",
      },
    })

    // Formatar dados para o formato desejado
    const formattedData: ConsumoData[] = consumos.map((consumo) => ({
      periodo: consumo.criadoEm.toLocaleDateString("pt-BR"),
      nome: consumo.user.name || consumo.user.email || "",
      produto: consumo.produto.nome,
      quantidade: consumo.quantidade,
      valorUnitario: Number(consumo.produto.valor),
      valorTotal: Number(consumo.valorTotal),
      statusPagamento: "", // Coluna vazia para preenchimento manual
    }))

    console.log(`Encontrados ${consumos.length} consumos históricos`)

    // Adicionar log para depuração
    if (consumos.length > 0) {
      console.log("Exemplo de primeiro registro:", {
        id: consumos[0].id,
        data: consumos[0].criadoEm,
        usuario: consumos[0].user.name,
        produto: consumos[0].produto.nome,
      })
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Erro ao buscar dados para exportação:", error)
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 })
  }
}
