/* eslint-disable react/react-in-jsx-scope */

import { Card, CardContent } from "./ui/card";

const Footer = () => {
    return ( 
        <footer>
            <div className="fixed bottom-0 w-full">            
                <Card>
                    <CardContent className=" text-center py-3 ">   
                        <p className="text-gray-400 text-xs">
                            © 2025 Teia Connect powered by <span className="font-bold">Urien Nolasco</span>               
                        </p>
                    </CardContent>
                </Card>
            </div>
        </footer>
     );
}
 
export default Footer;