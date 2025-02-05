/* eslint-disable react/react-in-jsx-scope */


export const revalidate = 0; // Para garantir renderização dinâmica

import ConsumoItem from "@/components/consumo-item";
import Header from "@/components/header";
import UserConsumptionOverview from "@/components/UserConsumptionOverview";
import { db } from "@/lib/prisma";
import { ToastContainer } from "react-toastify"

const ConsumeManagement = async () => {
    const consumos = await db.consumo.findMany({});
    
    const consumosPlain = consumos.map((consumo) => ({
        ...consumo,
        valorTotal: Number(consumo.valorTotal),
    }));

    return ( 
        <div>
            <Header />
            <ToastContainer />
            <h1 className="ml-4 mt-6 text-sm font-bold uppercase ">Visão geral de consumo</h1>
            <div className="flex ml-4 mt-4 gap-4 overflow-auto [&::-webkit-scrollbar]:hidden border-b border-solid py-7 ">                
                {consumosPlain.map((consumo) => (
                    <ConsumoItem key={consumo.id} consumo={consumo}/>
                ))}
            </div>
            <div className=" mt-6 text-sm font-bold uppercase pb-2">
                <h1 className="ml-4">Valores a Pagar</h1>
                    <UserConsumptionOverview />
            </div>
        </div>
     );
};
 
export default ConsumeManagement;
