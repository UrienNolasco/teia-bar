-- CreateTable
CREATE TABLE "ConsumoHistorico" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "dataConsumo" TIMESTAMP(3) NOT NULL,
    "dataRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsumoHistorico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConsumoHistorico_dataConsumo_idx" ON "ConsumoHistorico"("dataConsumo");

-- CreateIndex
CREATE INDEX "ConsumoHistorico_usuarioId_idx" ON "ConsumoHistorico"("usuarioId");

-- CreateIndex
CREATE INDEX "ConsumoHistorico_produtoId_idx" ON "ConsumoHistorico"("produtoId");

-- AddForeignKey
ALTER TABLE "ConsumoHistorico" ADD CONSTRAINT "ConsumoHistorico_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumoHistorico" ADD CONSTRAINT "ConsumoHistorico_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
