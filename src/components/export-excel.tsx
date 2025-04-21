"use client"
import { FileDown } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { toast } from "react-toastify"
import { isUserAdmin } from "@/app/actions/get-useradmin"

const ExportExcel = () => {
  const { data: session } = useSession()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Obter o mês anterior
  const getPreviousMonth = () => {
    const date = new Date()
    date.setMonth(date.getMonth() - 1)
    return date.toLocaleString("pt-BR", { month: "long" })
  }

  // Capitalizar primeira letra
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const previousMonth = capitalizeFirstLetter(getPreviousMonth())

  const handleDialogOpen = async () => {
    try {
      if (!session || !session.user || !session.user.email) {
        toast.warning(
          "Você precisa estar logado para acessar esta funcionalidade.",
        )
        return
      }

      const isAdmin = await isUserAdmin(session.user.email)
      if (!isAdmin) {
        toast.error("Apenas administradores podem exportar dados.")
        return
      }

      setIsDialogOpen(true)
    } catch (error) {
      console.error("Erro ao verificar permissão do usuário:", error)
      toast.error("Erro ao verificar permissão.")
    }
  }

  const handleOnClickSave = async () => {
    try {
      toast.success(
        `Exportando dados de ${previousMonth}. O download começará em breve.`,
      )
      setIsDialogOpen(false)
      // Aqui você implementará a lógica de exportação posteriormente
    } catch (error) {
      console.error("Erro ao exportar dados", error)
      toast.error("Erro ao exportar dados.")
    }
  }

  return (
    <>
      <Button
        className="h-10 w-10 gap-2 bg-green-600"
        onClick={handleDialogOpen}
      >
        <FileDown />
      </Button>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => setIsDialogOpen(open)}
      >
        <DialogContent className="w-[80%] rounded-2xl">
          <DialogTitle className="text-2xl">
            Exportar dados de consumo
          </DialogTitle>
          <p>
            Os dados do mês de <strong>{previousMonth}</strong> estão prontos
            para exportação.
          </p>
          <p>Deseja exportar estes dados para Excel?</p>
          <DialogFooter className="mt-2">
            <Button className="bg-green-600" onClick={handleOnClickSave}>
              Exportar {previousMonth}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ExportExcel
