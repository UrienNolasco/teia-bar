import { db } from "@/lib/prisma"

export const deletarConsumo = async () => {
    try {
        await db.consumo.deleteMany()
        console.log("Todos os consumos foram deletados com sucesso.")
    } catch (error) {
        console.error("Erro ao deletar consumo:", error)
    }
}