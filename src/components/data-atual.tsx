import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const CurrentDay:React.FC = () => {

    const today = new Date();
    const formattedDate = format(today, "eeee, d 'de' MMMM 'de' yyyy", {locale: ptBR});	
    return ( 
        <p className="text-sm">
            {formattedDate}
        </p >
     )
    ;
}
 
export default CurrentDay;