import Header from "@/components/header"
import ProdutoItem from "@/components/produto-item"
import { db } from "@/lib/prisma"

const Home = async () => {

  const produtos = await db.produto.findMany({})

  return (
    <div>
        <Header />
        <div className="p-5">
          <h2 className="text-base font-bold">Olá, Urien! O que você deseja beber hoje?</h2>
          <p className="text-sm">Sexta-feira, 17 de janeiro.</p>
          <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">Bebidas</h2>
          <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
            {produtos.map(produto => <ProdutoItem key={produto.id} produto={produto}/>)}
          </div>
        </div>
    </div>
)
}

export default Home
