/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getBeverageConsumptionByMonth } from "@/app/actions/get-avaregeConsumeMonth"

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Removed the invalid top-level useState here

const colors = [
  'hsl(205, 70%, 50%)',
  'hsl(120, 70%, 50%)',
  'hsl(30, 70%, 50%)',
  'hsl(300, 70%, 50%)',
  'hsl(60, 70%, 50%)',
  'hsl(180, 70%, 50%)'
]

export function BeverageConsumptionChart() {
    const id = "beverage-pie-chart"
    const [selectedMonth, setSelectedMonth] = React.useState(0)
    const [activeIndex, setActiveIndex] = React.useState(0)
  
    // Keep the useState for chartData here inside the component
    const [chartData, setChartData] = React.useState<{
      month: string
      data: Array<{beverageId: string, beverageName: string, total: number, fill: string}>
    } | null>(null)
  
    const chartConfig = React.useMemo<ChartConfig>(() => ({
      total: {
        label: 'Total de Bebidas',
        color: 'hsl(205, 70%, 50%)'
      },
      ...(chartData?.data.reduce((acc, item, index) => ({
        ...acc,
        [item.beverageId]: {
          label: item.beverageName,
          color: colors[index % colors.length]
        }
      }), {}) || {})
    }), [chartData])
  
    React.useEffect(() => {
      const fetchData = async () => {
        const serverData = await getBeverageConsumptionByMonth(selectedMonth)
        
        const dataWithColors = serverData.data.map((item, index) => ({
          ...item,
          fill: colors[index % colors.length]
        }))
    
        setChartData({
          month: serverData.month,
          data: dataWithColors
        })
      }
      fetchData()
    }, [selectedMonth])
  
    if (!chartData) return <div>Carregando...</div>

  return (
    <Card data-chart={id} className="mx-auto max-w-4xl w-full">
      <ChartStyle id={id} config={chartConfig}/>
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Consumo de Bebidas</CardTitle>
          <CardDescription>{chartData.month} 2024</CardDescription>
        </div>
        <Select 
          value={String(selectedMonth)} 
          onValueChange={(v) => setSelectedMonth(Number(v))}
        >
          <SelectTrigger className="ml-auto h-7 w-[150px] rounded-lg pl-2.5">
            <SelectValue placeholder="Selecione o mês" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {monthNames.map((month, index) => (
              <SelectItem
                key={index}
                value={String(index)}
                className="rounded-lg [&_span]:flex"
              >
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer 
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Pie
              data={chartData.data}
              dataKey="total"
              nameKey="beverageName"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  const activeItem = chartData.data[activeIndex]
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {activeItem.total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {activeItem.beverageName}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}