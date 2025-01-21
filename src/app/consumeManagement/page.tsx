import ConsumoItem from "@/components/consumo-item";
import Header from "@/components/header";
import { db } from "@/lib/prisma";

const ConsumeManagement = async () => {

    const consumos = await db.consumo.findMany({})
    
    const consumosPlain = consumos.map((consumo)=> ({
        ...consumo,
        valorTotal: Number(consumo.valorTotal),
    }))

    return ( 
        <div>
            <Header />
            <h1 className="ml-4 mt-6 text-sm font-bold uppercase" > Visão geral de consumo</h1>
            <div className="flex ml-4 mt-4 gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">                
                {consumosPlain.map((consumo) => (
                    <ConsumoItem key={consumo.id} consumo={consumo}/>
                ))}
            </div>
            
        </div>
     );
}
 
export default ConsumeManagement;