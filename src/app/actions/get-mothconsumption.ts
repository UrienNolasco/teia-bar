"use server"

import { db } from '@/lib/prisma';

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export async function getConsumptionTotalsByMonth() {
  // Consulta todos os registros de consumo
  const consumos = await db.consumoHistorico.findMany({
    orderBy: { criadoEm: 'asc' },
    include: { produto: true }
  });

  // Inicializa o array de meses com total zero
  const monthlyData = Array.from({ length: 12 }, (_, index) => ({
    month: monthNames[index],
    total: 0,
  }));

  // Soma o consumo total de todos os produtos por mês
  consumos.forEach(consumo => {
    const data = new Date(consumo.criadoEm);
    const monthIndex = data.getMonth();
    monthlyData[monthIndex].total += consumo.quantidade;
  });

  return monthlyData;
}