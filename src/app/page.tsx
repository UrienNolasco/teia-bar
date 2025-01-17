import { Button } from "@/components/ui/button"


const Home = () => {
  return ( 
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl text-green-500">Botão</h1>
      <Button variant="default">Text</Button>
    </div>
   );
}
 
export default Home;