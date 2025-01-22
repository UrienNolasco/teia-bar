/* eslint-disable react/react-in-jsx-scope */


import CurrentDay from "@/components/data-atual"
import Header from "@/components/header"
import ProdutoItem from "@/components/produto-item"
import UserName from "@/components/usuario-logado"
import { db } from "@/lib/prisma"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";


const Home = async () => {

  const produtos = await db.produto.findMany({})
  
  const produtosPlain = produtos.map((produto) => ({
    ...produto,
    valor: produto.valor.toNumber(),
  }));


  return (
    <div>
        <Header />
        <div className="p-5">
          <UserName />
          <CurrentDay />
          <ToastContainer />
          <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">Bebidas</h2>
          <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden ">
          {produtosPlain.map((produto) => (
            <ProdutoItem key={produto.id} produto={produto} />
          ))}
          </div>
        </div>
    </div>
)
}

export default Home
