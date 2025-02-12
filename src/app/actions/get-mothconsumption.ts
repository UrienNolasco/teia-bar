/* eslint-disable @typescript-eslint/no-unused-vars */


import { db } from '@/lib/prisma';

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

async function getTotalConsumptionPerMonth() {
  // Busca todos os registros de consumo.
  // Caso queira filtrar somente bebidas, você pode adicionar um filtro (por exemplo, se tiver uma categoria no produto).
  const consumos = await db.consumoHistorico.findMany({
    orderBy: { criadoEm: 'asc' },
    // Se necessário, inclua o relacionamento com Produto para utilizar alguma informação:
    include: { produto: true }
  });

  // Inicializa um array com 12 posições, uma para cada mês, com total zero.
  const monthlyData = Array.from({ length: 12 }, (_, index) => ({
    month: monthNames[index],
    total: 0
  }));

  // Para cada consumo, extrai o mês a partir de 'criadoEm' e acumula a quantidade.
  consumos.forEach(consumo => {
    // Cria um objeto Date a partir do campo criadoEm
    const data = new Date(consumo.criadoEm);
    const monthIndex = data.getMonth(); // getMonth() retorna 0 para Janeiro, 1 para Fevereiro etc.
    // Adiciona a quantidade consumida naquele mês
    monthlyData[monthIndex].total += consumo.quantidade;
  });

  return monthlyData;
}
