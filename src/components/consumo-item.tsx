/* eslint-disable react/react-in-jsx-scope */

import { Card, CardContent } from "./ui/card";

interface ConsumoItemProp {
    consumo: {
        id: string;
        valorTotal: number;
        quantidade: number;
        criadoEm: Date;
        // Nomes recebidos diretamente como props
        userName: string;
        produtoName: string;
    }
}

// Pode ser um Server Component simples agora (sem async se não precisar)
const ConsumoItem = ({consumo}:ConsumoItemProp) => {
    // Não precisa mais buscar dados aqui!
    return (
        <Card className=" min-w-[200px] rounded-2xl">
            <CardContent className="p-0 px-2 pt-2">
                <div className=" relative h-[170px] w-full" >
                    <p className="font-semibold">
                        Quem consumiu:
                    </p>
                    <p>
                        {/* Usar o nome recebido via prop */}
                        {consumo.userName}
                    </p>
                    <p className="mt-2 font-semibold ">
                        O que consumiu:
                    </p>
                    <p>
                         {/* Usar o nome recebido via prop */}
                        {consumo.produtoName}
                    </p>
                    <p className="mt-2 font-semibold">
                        Quando Consumiu:
                    </p>
                    <p>
                        {consumo.criadoEm.toLocaleDateString()}
                    </p>
                </div>
            </CardContent>
        </Card>
     );
}

export default ConsumoItem;