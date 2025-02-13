"use server";

import { db } from '@/lib/prisma';

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export async function getBeverageConsumptionByMonth(month: number) {
  const allBeverages = await db.produto.findMany();

  const consumos = await db.consumoHistorico.findMany({
    where: {
      criadoEm: {
        gte: new Date(new Date().getFullYear(), month, 1),
        lt: new Date(new Date().getFullYear(), month + 1, 1)
      }
    },
    include: { produto: true }
  });

  // Retorna apenas os dados essenciais
  const data = allBeverages.map(beverage => {
    const total = consumos
      .filter(c => c.produtoId === beverage.id)
      .reduce((sum, c) => sum + c.quantidade, 0);

    return {
      beverageId: beverage.id,
      beverageName: beverage.nome,
      total // Removemos o campo 'fill' aqui
    };
  });

  return {
    month: monthNames[month],
    data
  };
}