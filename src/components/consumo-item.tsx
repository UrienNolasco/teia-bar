"use client"
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */


import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { getProdutoNome } from "@/app/actions/get-produtoname";
import { getUserName } from "@/app/actions/get-username";

interface ConsumoItemProp {
    consumo: {
        id: string;
        valorTotal: number;
        quantidade: number;
        criadoEm: Date;
        usuarioId: string;
        produtoId: string;
    }
}

const ConsumoItem = ({consumo}:ConsumoItemProp) => {
    const [produtoNome, setProdutoNome] = useState<string | null>(null);

    const [userName, setUsername] = useState<string | null>(null);
    

    useEffect(() => {
        const fetchUserName = async () => {
            try{
                const name = await getUserName({usuarioId: consumo.usuarioId});
                setUsername(name);
            }catch(error){
                setUsername("Erro ao buscar nome");
            }
        };
        fetchUserName();
    }, [consumo.usuarioId]);

    useEffect(() => {
        const fetchProdutoNome = async () => {
            try{
                const nome = await getProdutoNome({produtoId: consumo.produtoId});
                setProdutoNome(nome);
            }catch(error){
                setProdutoNome("Erro ao buscar produto");
            }
        };
        fetchProdutoNome();
    }, [consumo.produtoId]);
    return ( 
        <Card className=" min-w-[200px] rounded-2xl">
            <CardContent className="p-0 px-2 pt-2">
                <div className=" relative h-[170px] w-full" >
                    <p className="font-semibold">
                        Quem consumiu: 
                    </p>
                    <p>
                        {userName}
                    </p>
                    <p className="mt-2 font-semibold ">
                        O que consumiu:  
                    </p>
                    <p>
                        {produtoNome}
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