"use client"
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const revalidate = 0

import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { useSession } from "next-auth/react"
import { toast } from "react-toastify"
import { createConsumo } from "@/app/actions/create-consumo"
import { deletarBebida } from "@/app/actions/delete-bebida"

interface ProdutoItemProp {
  produto: {
    id: string

    nome: string

    descricao: string | null

    valor: number

    quantidadeEstoque: number

    criadoEm: Date

    imageUrl: string | null
  }
  isRemoving?: boolean
}

const ProdutoItem = ({ produto, isRemoving = false }: ProdutoItemProp) => {
  const { data: session } = useSession()
  const { data } = useSession()

  const quantidade = 1

  const handleClickOnbutton = async () => {
    if (isRemoving) {
      try {
        await deletarBebida({
          id: produto.id,
        })
        toast.success("Produto removido com sucesso")
      } catch (error) {
        console.error("Erro ao remover produto:", error)
        toast.error("Erro ao remover produto")
      }
    } else {
      try {
        if (!session) {
          toast.warning("Você precisa estar logado para realizar uma compra.")
          return
        }
        await createConsumo({
          produtoId: produto.id,
          usuarioId: (data?.user as any).id,
          criadoEm: new Date(),
          quantidade: quantidade,
          valorTotal: Number(produto.valor) * quantidade,
        })
        toast.success("Compra realizada com sucesso")
      } catch (error) {
        console.error(error)
        toast.error("Produto sem estoque.")
      }
    }
  }

  return (
    <Card className="min-w-[159px] rounded-2xl">
      <CardContent className="p-0 px-2 pt-2">
        {/* IMAGEM */}
        <div className="relative h-[159px] w-full">
          <Image
            className="rounded-2xl object-contain"
            fill
            src={produto.imageUrl ?? "/default-image.png"}
            alt={produto.nome}
            overrideSrc={produto.imageUrl ?? undefined}
          />
          <Badge className="absolute left-2 top-2 space-x-1">
            {/* <CircleDollarSign size={17}  /> */}
            <p className="text-xs font-semibold">
              {Number(produto.valor).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </Badge>
        </div>

        {/* TEXTO */}
        <div className="py-3 text-center">
          <h3 className="truncate font-semibold">{produto.nome}</h3>
          <p className="ext-xs mx-auto max-w-xs truncate text-gray-400">
            {" "}
            {produto.descricao}{" "}
          </p>
          <Button
            variant="secondary"
            className="mt-3 w-full"
            onClick={handleClickOnbutton}
          >
            {isRemoving ? "Remover" : "Comprar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProdutoItem
