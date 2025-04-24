/* eslint-disable react/react-in-jsx-scope */

import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarImage } from "./ui/avatar"

// Interface para os dados do usuário que o componente espera receber
interface ProcessedUser {
  id: string
  nome: string | null
  fotoUrl: string | null
  consumoCount: number
  totalConsumption: number
}

interface UserConsumptionOverviewProps {
  users: ProcessedUser[] // Recebe a lista de usuários processados
}

// Não precisa ser async
const UserConsumptionOverview = ({ users }: UserConsumptionOverviewProps) => {
  // Não busca mais dados, apenas renderiza o que recebeu
  return (
    <div className="mb-10 grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Mapeia os usuários recebidos via props */}
      {users.map((user) => (
        <Card key={user.id} className="rounded-lg shadow-md">
          <CardContent className="flex items-center p-4">
            <Avatar>
              {/* Usa a fotoUrl da prop */}
              <AvatarImage src={user?.fotoUrl ?? ""} />
            </Avatar>
            <div className="ml-4">
              {/* Usa o nome da prop */}
              <h2 className="text-lg font-bold">
                {user.nome ?? "Nome não disponível"}
              </h2>
              <p className="text-sm text-gray-600">
                {/* Usa a contagem da prop */}
                Consumos: {user.consumoCount}
              </p>
              <p className="text-sm text-gray-600">
                {/* Usa o total da prop */}
                Valor Total: R$ {user.totalConsumption.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default UserConsumptionOverview
