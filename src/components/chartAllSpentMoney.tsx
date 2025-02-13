/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";


import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSpentTotalsByMonth } from "@/app/actions/get-monthspent";

type MonthlyTotal = {
  month: string;
  total: number;
};

export default function ChartAllSpentMoney() {
  const [consumptionData, setConsumptionData] = useState<MonthlyTotal[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getSpentTotalsByMonth();
        setConsumptionData(data);
      } catch (error) {
        console.error("Erro ao buscar dados de consumo:", error);
      }
    }
    fetchData();
  }, []);

  const chartConfig = {
    total: {
      label: 'Consumo Total',
      color: "hsl(205, 70%, 50%)",
    }
  };

  return (
    <> 
    
    <Card className="mx-auto max-w-4xl w-full">
      <CardHeader>
        <CardTitle>Valor total gasto por mês</CardTitle>
        <CardDescription>
          Valor agregado de todas as bebidas no mês
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <div className="h-[300px] w-full overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <div className="min-w-[600px] h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consumptionData} margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 40, 
              }}>
                <CartesianGrid 
                  vertical={false} 
                  stroke="#696969" 
                  />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  angle={-40} 
                  textAnchor="middle"
                  interval={0} 
                  tick={{ 
                    fontSize: 12,
                    fill: 'hsl(215.4 16.3% 46.9%)', 
                    dy: 10,
                  }}
                  tickMargin={25} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar
                  dataKey="total"
                  fill={chartConfig.total.color}
                  radius={4}
                  name="R$"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
}