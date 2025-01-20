import CurrentDay from "@/components/data-atual"
import Header from "@/components/header"
import ProdutoItem from "@/components/produto-item"
import UserName from "@/components/usuario-logado"
import { db } from "@/lib/prisma"

const Home = async () => {

  const produtos = await db.produto.findMany({})
  
  return (
    <div>
        <Header />
        <div className="p-5">
          <UserName />
          <CurrentDay />
          <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">Bebidas</h2>
          <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
            {produtos.map(produto => <ProdutoItem key={produto.id} produto={produto}/>)}
          </div>
        </div>
    </div>
)
}

export default Home
