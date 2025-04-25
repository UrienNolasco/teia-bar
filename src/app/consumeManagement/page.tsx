/* eslint-disable react/react-in-jsx-scope */
import ConsumoItem from "@/components/consumo-item"
import Header from "@/components/header"
import UserConsumptionOverview from "@/components/UserConsumptionOverview"
import { db } from "@/lib/prisma"

import { ToastContainer } from "react-toastify"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface ProcessedUser {
  id: string
  nome: string | null
  fotoUrl: string | null
  consumoCount: number
  totalConsumption: number
}

const ConsumeManagement = async () => {
  const consumosComRelacionamentos = await db.consumo.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      produto: {
        select: {
          id: true,
          nome: true,
        },
      },
    },
    orderBy: {
      criadoEm: "desc",
    },
  })

  const userConsumptionMap = new Map<string, ProcessedUser>()

  consumosComRelacionamentos.forEach((consumo) => {
    if (!consumo.user) return

    const userId = consumo.user.id
    let userData = userConsumptionMap.get(userId)

    if (!userData) {
      userData = {
        id: userId,
        nome: consumo.user.name,
        fotoUrl: consumo.user.image,
        consumoCount: 0,
        totalConsumption: 0,
      }
    }

    userData.consumoCount += 1
    userData.totalConsumption += Number(consumo.valorTotal)

    userConsumptionMap.set(userId, userData)
  })

  const processedUsersForOverview: ProcessedUser[] = Array.from(
    userConsumptionMap.values(),
  )

  const consumosParaItens = consumosComRelacionamentos.map((consumo) => ({
    id: consumo.id,
    valorTotal: Number(consumo.valorTotal),
    quantidade: consumo.quantidade,
    criadoEm: consumo.criadoEm,
    userName: consumo.user?.name ?? "Usuário não encontrado",
    produtoName: consumo.produto?.nome ?? "Produto não encontrado",
  }))

  return (
    <div>
      <Header />
      <ToastContainer />
      <h1 className="ml-4 mt-6 text-sm font-bold uppercase">
        Visão geral de consumo
      </h1>
      <div className="ml-4 mt-4 flex gap-4 overflow-auto border-b border-solid py-7 [&::-webkit-scrollbar]:hidden">
        {consumosParaItens.map((consumo) => (
          <ConsumoItem key={consumo.id} consumo={consumo} />
        ))}
      </div>
      <div className="mt-6 pb-2 text-sm font-bold uppercase">
        <h1 className="ml-4">Valores a Pagar</h1>
        <UserConsumptionOverview users={processedUsersForOverview} />
      </div>
    </div>
  )
}

export default ConsumeManagement
