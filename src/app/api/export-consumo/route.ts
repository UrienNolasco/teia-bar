/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { isUserAdmin } from "@/app/actions/get-useradmin"
import { db } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

interface ConsumoData {
  periodo: string
  nome: string
  produto: string
  quantidade: number
  valorUnitario: number
  valorTotal: number
  statusPagamento: string
}

const querySchema = z.object({
  // Espera strings no formato ISO 8601 (ex: "2023-10-26T10:00:00.000Z")
  startDate: z
    .string()
    .datetime({ message: "Formato da data inicial inválido." }),
  endDate: z.string().datetime({ message: "Formato da data final inválido." }),
})

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    console.log("API de exportação chamada")

    // 1. Autenticação e Autorização (mantido)
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }
    const isAdmin = await isUserAdmin(session.user.email)
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Apenas administradores podem exportar dados" },
        { status: 403 },
      )
    }

    // 2. Obter e Validar Query Parameters de Data
    const { searchParams } = new URL(request.url)
    const validationResult = querySchema.safeParse({
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
    })

    // Se a validação falhar, retorna erro 400
    if (!validationResult.success) {
      console.warn(
        "Validação de parâmetros de data falhou:",
        validationResult.error.flatten(),
      )
      return NextResponse.json(
        {
          error: "Parâmetros de data inválidos ou ausentes.",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }, // Bad Request
      )
    }

    // Extrair datas validadas (strings ISO)
    const { startDate: startDateString, endDate: endDateString } =
      validationResult.data

    // Converter strings ISO para objetos Date para o Prisma
    const startDate = new Date(startDateString)
    const endDate = new Date(endDateString) // A data final já vem ajustada do frontend (fim do dia)

    console.log(
      `Buscando consumos históricos de ${startDate.toISOString()} até ${endDate.toISOString()}`, // Log atualizado
    )

    // 3. Buscar Consumos no Banco de Dados com Filtro de Data
    const consumos = await db.consumoHistorico.findMany({
      where: {
        // Aplicar o filtro usando as datas recebidas
        criadoEm: {
          gte: startDate, // Maior ou igual à data inicial
          lte: endDate, // Menor ou igual à data final
        },
      },
      // Incluir dados relacionados (mantido)
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
            email: true, // Mantido email caso nome seja null
          },
        },
      },
      // Ordenar resultados (mantido)
      orderBy: {
        criadoEm: "asc",
      },
    })

    // 4. Formatar Dados (mantido - 'periodo' agora mostra a data específica)
    const formattedData: ConsumoData[] = consumos.map((consumo) => ({
      periodo: consumo.criadoEm.toLocaleDateString("pt-BR", {
        // Formato mais explícito
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      nome: consumo.user.name || consumo.user.email || "Usuário Desconhecido", // Fallback melhorado
      produto: consumo.produto?.nome || "Produto Desconhecido", // Adicionado fallback para produto
      quantidade: consumo.quantidade,
      valorUnitario: Number(consumo.produto?.valor) || 0, // Adicionado fallback e conversão segura
      valorTotal: Number(consumo.valorTotal) || 0, // Conversão segura
      statusPagamento: "", // Mantido vazio
    }))

    console.log(
      `Encontrados ${consumos.length} consumos históricos no período selecionado.`,
    ) // Log atualizado

    // Log de exemplo (mantido)
    if (consumos.length > 0) {
      console.log("Exemplo de primeiro registro:", {
        id: consumos[0].id,
        data: consumos[0].criadoEm,
        usuario: consumos[0].user.name,
        produto: consumos[0].produto?.nome,
      })
    }

    // 5. Retornar Dados Formatados
    return NextResponse.json(formattedData)
  } catch (error) {
    // Tratamento de erro (mantido)
    console.error("Erro na API de exportação:", error)
    // Evitar expor detalhes do erro interno em produção, se possível
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido"
    return NextResponse.json(
      {
        error: "Erro interno ao processar a solicitação.",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
