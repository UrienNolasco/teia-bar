import Header from "@/components/header";
import ConsumoPessoalItem from "@/components/personal-consumo-item";
import { db } from "@/lib/prisma";

const consumeManagementUnique = async() => {

    const consumos = await db.consumo.findMany({});
    
    const consumosPlain = consumos.map((consumo) => ({
        ...consumo,
        valorTotal: Number(consumo.valorTotal),
    }));
    
    return ( 
        <div>
            <Header />
            <h1 className="ml-4 mt-6 text-sm font-bold uppercase ">Visão pessoal de consumo</h1>
            <div className="flex ml-4 mt-4 gap-4 overflow-auto [&::-webkit-scrollbar]:hidden border-b border-solid py-7 ">
                {consumosPlain.map((consumo) => (
                    <ConsumoPessoalItem key={consumo.id} consumo={consumo}/>
                ))}
            </div >
        </div>
     );
}
 
export default consumeManagementUnique;