/*
  Warnings:

  - You are about to drop the column `dataConsumo` on the `ConsumoHistorico` table. All the data in the column will be lost.
  - You are about to drop the column `dataRegistro` on the `ConsumoHistorico` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ConsumoHistorico_dataConsumo_idx";

-- DropIndex
DROP INDEX "ConsumoHistorico_produtoId_idx";

-- DropIndex
DROP INDEX "ConsumoHistorico_usuarioId_idx";

-- AlterTable
ALTER TABLE "ConsumoHistorico" DROP COLUMN "dataConsumo",
DROP COLUMN "dataRegistro",
ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
