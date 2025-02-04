import ConsumoPessoalOverview from "@/components/consumopessoaloverview";
import Header from "@/components/header";
import ConsumoPessoalItem from "@/components/personal-consumo-item";
import UserConsumoSummary from "@/components/userconsumosummary";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";

const consumeManagementUnique = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const consumos = await db.consumo.findMany({});

  const calculoValorDevido = await db.user.findMany({
    include: {
      consumos: {
        select: {
          id: true,
          valorTotal: true,
        },
      },
    },
  });

  const consumosPlain = consumos.map((consumo) => ({
    ...consumo,
    valorTotal: Number(consumo.valorTotal),
  }));

  // Verifica se há dados antes de renderizar
  if (calculoValorDevido.length === 0) {
    return (
      <div>
        <Header />
        <p className="mt-4 ml-4">Nenhum usuário encontrado</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <h1 className="ml-4 mt-6 text-sm font-bold uppercase">Visão pessoal de consumo</h1>
      
      <div className="flex ml-4 mt-4 gap-4 overflow-auto [&::-webkit-scrollbar]:hidden border-b border-solid py-7 ">
        {consumosPlain.map((consumo) => (
          <ConsumoPessoalItem key={consumo.id} consumo={consumo} />
        ))}

      </div >
        
      <div className="ml-4 border-b border-solid py-7">
        {userId && <UserConsumoSummary userId={userId} />}
      </div>

      <div className="mt-6 text-sm font-bold uppercase pb-2">
        <h1 className="ml-4">Bebidas Consumidas no mês</h1>
        <ConsumoPessoalOverview />
      </div>
    </div>
  );
};

export default consumeManagementUnique;