/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { db } from "@/lib/prisma";

const UserConsumoSummary = async({userId}: {userId: string}) => {
    const consumos = await db.consumo.findMany({
        where: {
            usuarioId: userId,
        },
    });

    const totalValor = consumos.reduce(
        (acc, consumo) => acc + Number(consumo.valorTotal),
        0
      );
    
      return (
        <div>
          <p className="text-sm font-bold uppercase">Valores a pagar: R$ {totalValor.toFixed(2)}</p>
        </div>
      );  
}
 
export default UserConsumoSummary;