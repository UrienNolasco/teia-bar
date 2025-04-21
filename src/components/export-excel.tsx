"use client"
/* eslint-disable react/react-in-jsx-scope */

import { FileDown } from "lucide-react"
import ExcelJS from "exceljs"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { toast } from "react-toastify"
import { saveAs } from "file-saver"
import { isUserAdmin } from "@/app/actions/get-useradmin"

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

  // Obter o mês anterior
  const getPreviousMonth = () => {
    const date = new Date()
    date.setMonth(date.getMonth() - 1)
    return date.toLocaleString("pt-BR", { month: "long" })
  }

  // Obter o ano e mês anterior para o nome do arquivo
  const getPreviousMonthYear = () => {
    const date = new Date()
    date.setMonth(date.getMonth() - 1)
    const month = date.toLocaleString("pt-BR", { month: "long" })
    const year = date.getFullYear()
    return `${month}_${year}`
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

  const handleExport = async () => {
    try {
      setIsLoading(true)

      // Buscar dados da API
      const response = await fetch("/api/export-consumo")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao buscar dados")
      }

      const data = (await response.json()) as ConsumoData[]

      if (data.length === 0) {
        toast.info(`Não há dados de consumo para ${previousMonth}.`)
        setIsDialogOpen(false)
        setIsLoading(false)
        return
      }

      // Criar workbook e worksheet
      const workbook = new ExcelJS.Workbook()
      workbook.creator = "TeiaBar"
      workbook.lastModifiedBy = "Sistema TeiaBar"
      workbook.created = new Date()
      workbook.modified = new Date()

      const worksheet = workbook.addWorksheet(`Consumos ${previousMonth}`, {
        pageSetup: {
          paperSize: 9, // A4
          orientation: "portrait",
          fitToPage: true,
        },
      })

      worksheet.mergeCells("A1:G1")
      const titleCell = worksheet.getCell("A1")
      titleCell.value = "TeiaBar - Controle de Consumo" // Novo título
      titleCell.font = {
        name: "Arial",
        size: 16,
        bold: true,
        color: { argb: "000000" },
      }
      titleCell.alignment = {
        horizontal: "center",
        vertical: "middle",
      }
      titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "E0E0E0" },
      }
      worksheet.getRow(1).height = 30

      // Adicionar informações adicionais
      worksheet.mergeCells("A2:G2")
      const infoCell = worksheet.getCell("A2")
      infoCell.value = `Relatório de Consumo - ${capitalizeFirstLetter(previousMonth)} | Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`
      infoCell.font = {
        name: "Arial",
        size: 10,
        italic: true,
      }
      infoCell.alignment = { horizontal: "right" }

      // Definir cabeçalhos na linha 3
      const headers = [
        { header: "Período", key: "periodo", width: 15 },
        { header: "Nome", key: "nome", width: 25 },
        { header: "Produto", key: "produto", width: 25 },
        { header: "Quantidade", key: "quantidade", width: 12 },
        { header: "Valor Unitário", key: "valorUnitario", width: 15 },
        { header: "Valor Total", key: "valorTotal", width: 15 },
        { header: "Status Pagamento", key: "statusPagamento", width: 18 },
      ]

      // Definir colunas com cabeçalhos
      worksheet.columns = headers

      // Garantir que os cabeçalhos sejam adicionados explicitamente
      // Estilizar cabeçalhos
      const headerRow = worksheet.getRow(3)
      headers.forEach((header, index) => {
        const cell = headerRow.getCell(index + 1)
        cell.value = header.header

        // Estilizar o cabeçalho
        cell.font = {
          name: "Arial",
          size: 12,
          bold: true,
          color: { argb: "FFFFFF" },
        }

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "4472C4" }, // Azul corporativo
        }

        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        }
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        }
      })
      headerRow.height = 20

      // Adicionar dados a partir da linha 4
      data.forEach((item: ConsumoData) => {
        worksheet.addRow({
          periodo: item.periodo,
          nome: item.nome,
          produto: item.produto,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
          valorTotal: item.valorTotal,
          statusPagamento: item.statusPagamento,
        })
      })

      // Estilizar células de dados
      const dataRows = worksheet.getRows(4, data.length)
      dataRows?.forEach((row, index) => {
        // Alternar cores de fundo para facilitar a leitura
        const fillColor = index % 2 === 0 ? "F5F5F5" : "FFFFFF"

        row.eachCell((cell) => {
          const colIndex = Number(cell.col)
          const colKey = headers[colIndex - 1]?.key

          cell.font = {
            name: "Arial",
            size: 11,
          }

          // Cor preta para células de status de pagamento
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: fillColor },
          }

          cell.border = {
            top: { style: "thin", color: { argb: "E0E0E0" } },
            left: { style: "thin", color: { argb: "E0E0E0" } },
            bottom: { style: "thin", color: { argb: "E0E0E0" } },
            right: { style: "thin", color: { argb: "E0E0E0" } },
          }

          // Alinhar colunas específicas
          if (
            colKey === "quantidade" ||
            colKey === "valorUnitario" ||
            colKey === "valorTotal"
          ) {
            cell.alignment = { horizontal: "right" }
          } else if (colKey === "periodo") {
            cell.alignment = { horizontal: "center" }
          } else if (colKey === "statusPagamento") {
            cell.alignment = { horizontal: "center" }
          }
        })
      })

      // Formatar colunas de valores como moeda
      worksheet.getColumn("valorUnitario").numFmt = '"R$ "#,##0.00'
      worksheet.getColumn("valorTotal").numFmt = '"R$ "#,##0.00'
      worksheet.getColumn("quantidade").numFmt = "#,##0"

      // Adicionar totais
      const totalRow = worksheet.getRow(data.length + 4)
      totalRow.getCell(1).value = "TOTAL"
      totalRow.getCell(1).font = {
        bold: true,
        size: 12,
      }

      // Fórmula para somar a coluna de valor total
      totalRow.getCell(6).value = {
        formula: `SUM(F4:F${data.length + 3})`,
        date1904: false,
      }
      totalRow.getCell(6).font = {
        bold: true,
        size: 12,
      }
      totalRow.getCell(6).numFmt = '"R$ "#,##0.00'

      // Estilizar linha de total
      totalRow.eachCell((cell) => {
        if (cell.value) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "E0E0E0" },
          }
          cell.border = {
            top: { style: "thin" },
            bottom: { style: "double" },
          }
        }
      })

      // Adicionar rodapé com fundo roxo
      const footerRow = worksheet.getRow(data.length + 6)
      worksheet.mergeCells(`A${data.length + 6}:G${data.length + 6}`)
      const footerCell = footerRow.getCell(1)
      footerCell.value = "TeiaBar - Controle de Consumo"
      footerCell.font = {
        bold: true,
        size: 11,
        color: { argb: "000000" }, // Texto preto
      }
      footerCell.alignment = { horizontal: "center" }
      footerCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "800080" }, // Roxo
      }
      footerRow.height = 20

      // Gerar arquivo
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      saveAs(blob, `Consumos_${getPreviousMonthYear()}.xlsx`)

      toast.success(`Dados de ${previousMonth} exportados com sucesso!`)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erro ao exportar dados:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Falha na exportação"
      toast.error(`Erro ao exportar: ${errorMessage}`)
    } finally {
      setIsLoading(false)
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
        onOpenChange={(open) => !isLoading && setIsDialogOpen(open)}
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
            <Button
              className="bg-green-600"
              onClick={handleExport}
              disabled={isLoading}
            >
              {isLoading ? "Exportando..." : `Exportar ${previousMonth}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ExportExcel
