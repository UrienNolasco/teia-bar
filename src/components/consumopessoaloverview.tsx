/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ConsumoPessoalOverview = async () => {
  // Obter a sessão do usuário
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // Buscar bebidas com consumos do usuário atual
  const drinksWithConsumption = await db.produto.findMany({
    include: {
      consumos: {
        where: {
          usuarioId: userId, // Filtro pelo usuário logado
        },
        select: {
          id: true,
        },
      },
    },
  });

  // Processar os dados das bebidas
  const processedDrinks = drinksWithConsumption.map((produto) => {
    const consumoCount = produto.consumos.length;
    const unitPrice = Number(produto.valor);
    const totalConsumption = consumoCount * unitPrice;

    return {
      id: produto.id,
      nome: produto.nome,
      fotoUrl: produto.imageUrl,
      consumoCount,
      unitPrice,
      totalConsumption,
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 mb-10">
      {processedDrinks.map((produto) => (
        <Card key={produto.id} className="shadow-md rounded-lg">
          <CardContent className="flex items-center p-4">
            <Avatar>
              <AvatarImage src={produto?.fotoUrl ?? ""} />
            </Avatar>
            <div className="ml-4">
              <h2 className="font-bold text-lg">{produto.nome}</h2>
              <p className="text-sm text-gray-600">
                Quantidade: {produto.consumoCount}
              </p>
              <p className="text-sm text-gray-600">
                Valor Unitário: R$ {produto.unitPrice.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                Valor Total: R$ {produto.totalConsumption.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConsumoPessoalOverview;