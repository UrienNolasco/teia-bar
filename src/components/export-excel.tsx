"use client"
/* eslint-disable react/react-in-jsx-scope */

import { CalendarIcon, FileDown } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { toast } from "react-toastify"
import { isUserAdmin } from "@/app/actions/get-useradmin"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Calendar } from "./ui/calendar"
import { cn } from "@/lib/utils"
import React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { exportConsumoToExcel } from "@/lib/exportutils"

interface ConsumoData {
  periodo: string
  nome: string
  produto: string
  quantidade: number
  valorUnitario: number
  valorTotal: number
  statusPagamento: string
}

const ExportExcel = () => {
  const { data: session } = useSession()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

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

  const handleExportClick = async () => {
    // Validar se ambas as datas foram selecionadas
    if (!startDate || !endDate) {
      toast.error("Selecione as datas inicial e final.")
      return
    }

    // Verificar se a data inicial é anterior à data final
    if (startDate > endDate) {
      toast.error("A data inicial deve ser anterior à data final.")
      return
    }

    setIsLoading(true)
    try {
      const exportSuccessful = await handleTrueExport(startDate, endDate)
      if (exportSuccessful) {
        toast.success("Exportação iniciada!")
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error("Erro ao exportar:", error)
      toast.error(
        `Falha ao exportar: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrueExport = async (
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> => {
    const adjustedEndDate = new Date(endDate)
    adjustedEndDate.setHours(23, 59, 59, 999)

    const params = new URLSearchParams()
    params.append("startDate", startDate.toISOString())
    params.append("endDate", adjustedEndDate.toISOString())
    const apiUrl = `/api/export-consumo?${params.toString()}`

    try {
      console.log("Chamando API:", apiUrl)
      const response = await fetch(apiUrl)

      if (!response.ok) {
        let errorMsg = "Erro ao buscar dados para exportação."
        try {
          const errorData = await response.json()
          errorMsg = errorData.error || errorData.message || errorMsg
        } catch (jsonError) {
          errorMsg = response.statusText || errorMsg
        }
        throw new Error(errorMsg)
      }

      const data = (await response.json()) as ConsumoData[]

      if (data.length === 0) {
        toast.info(
          `Não há dados de consumo entre ${format(startDate, "dd/MM/yyyy", { locale: ptBR })} e ${format(endDate, "dd/MM/yyyy", { locale: ptBR })}.`,
        )
        return false
      }

      await exportConsumoToExcel(data, startDate, endDate)
      return true
    } catch (error) {
      console.error("Erro em handleTrueExport:", error)
      throw error
    }
  }

  const isExportDisabled = isLoading || !startDate || !endDate

  return (
    <div>
      <Button onClick={handleDialogOpen} className="bg-green-500">
        <FileDown    />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Exportar Dados</DialogTitle>
          <div className="py-4">
            <p className="mb-4">
              Selecione o intervalo de tempo para exportação dos dados.
            </p>

            <div className="grid gap-4">
              {/* Data Inicial */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Data Inicial
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione a data inicial</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Data Final */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Data Final
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione a data final</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      locale={ptBR}
                      disabled={(date) => !startDate || date < startDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleExportClick} disabled={isExportDisabled}>
              {isLoading ? "Exportando..." : "Exportar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ExportExcel
