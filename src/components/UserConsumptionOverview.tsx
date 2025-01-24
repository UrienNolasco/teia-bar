/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { db } from "@/lib/prisma";

const UserConsumptionOverview = async () => {
  const usersWithConsumption = await db.user.findMany({
    include: {
      consumos: {
        select: {
          id: true,
          valorTotal: true,
        },
      },
    },
  });


  const processedUsers = usersWithConsumption.map((user) => {
    const consumoCount = user.consumos.length;
    const totalConsumption = user.consumos.reduce(
      (acc, consumo) => acc + Number(consumo.valorTotal),
      0
    );

    return {
      id: user.id,
      nome: user.name,
      fotoUrl: user.image,
      consumoCount,
      totalConsumption,
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 mb-10">
      {processedUsers.map((user) => (
        <Card key={user.id} className="shadow-md rounded-lg">
          <CardContent className="flex items-center p-4">
            {/* Foto do usuário */}
            <Avatar>
              <AvatarImage src={user?.fotoUrl ?? ""} />
            </Avatar>
            <div className="ml-4">
              {/* Nome do usuário */}
              <h2 className="font-bold text-lg">{user.nome}</h2>
              {/* Quantidade de consumos e valor total */}
              <p className="text-sm text-gray-600">
                Consumos: {user.consumoCount}
              </p>
              <p className="text-sm text-gray-600">
                Valor Total: R$ {user.totalConsumption.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserConsumptionOverview;
