/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const revalidate = 0;

import ChartAllConsume from "@/components/chartAllConsume";
import ChartAllSpentMoney from "@/components/chartAllSpentMoney";
import Header from "@/components/header";


const Charts = () => {
    return ( 
        <div>
            <Header />
                <div className="h-max pb-14">
                    <div className="my-4">
                        <ChartAllConsume />
                    </div>
                        <ChartAllSpentMoney />
                </div>

        </div>
     );
}
 
export default Charts;