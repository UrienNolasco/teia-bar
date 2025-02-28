/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const revalidate = 0

import { BeverageConsumptionChart } from "@/components/BeverageConsumptionChart"
import ChartAllConsume from "@/components/chartAllConsume"
import ChartAllSpentMoney from "@/components/chartAllSpentMoney"
import Header from "@/components/header"

const Charts = () => {
  return (
    <div>
      <Header />
      <div className="h-max pb-14">
        <div className="my-4">
          <ChartAllConsume />
        </div>
        <div className="my-4">
          <ChartAllSpentMoney />
        </div>
        <BeverageConsumptionChart />
      </div>
    </div>
  )
}

export default Charts
