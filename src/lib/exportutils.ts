/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Defina ou importe a interface ConsumoData aqui também
// (É bom ter tipos compartilhados ou importá-los de um local comum)
interface ConsumoData {
  periodo: string
  nome: string
  produto: string
  quantidade: number
  valorUnitario: number
  valorTotal: number
  statusPagamento: string
}

// Função auxiliar para formatar o nome do arquivo (substitui getPreviousMonthYear)
const formatDateRangeForFilename = (start: Date, end: Date): string => {
  const startDateStr = format(start, "yyyy-MM-dd")
  const endDateStr = format(end, "yyyy-MM-dd")
  return `${startDateStr}_a_${endDateStr}`
}

// Função principal de exportação
export const exportConsumoToExcel = async (
  data: ConsumoData[],
  startDate: Date,
  endDate: Date,
): Promise<void> => {
  try {
    // --- Lógica para GERAR e BAIXAR o arquivo Excel ---
    const workbook = new ExcelJS.Workbook()
    workbook.creator = "TeiaBar"
    workbook.lastModifiedBy = "Sistema TeiaBar"
    workbook.created = new Date()
    workbook.modified = new Date()

    const dateRangeStr = `${format(startDate, "dd/MM/yyyy", { locale: ptBR })} a ${format(endDate, "dd/MM/yyyy", { locale: ptBR })}`
    const worksheetName = `Consumos ${format(startDate, "MMM yyyy", { locale: ptBR })}` // Nome da aba pode ser o mês inicial

    const worksheet = workbook.addWorksheet(worksheetName.substring(0, 31), {
      // Limita nome da aba a 31 chars
      pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true },
    })

    // Título
    worksheet.mergeCells("A1:G1")
    const titleCell = worksheet.getCell("A1")
    titleCell.value = "TeiaBar - Controle de Consumo"
    titleCell.font = {
      name: "Arial",
      size: 16,
      bold: true,
      color: { argb: "000000" },
    }
    titleCell.alignment = { horizontal: "center", vertical: "middle" }
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "E0E0E0" },
    }
    worksheet.getRow(1).height = 30

    // Informações Adicionais (com intervalo de datas)
    worksheet.mergeCells("A2:G2")
    const infoCell = worksheet.getCell("A2")
    infoCell.value = `Relatório de Consumo - Período: ${dateRangeStr} | Gerado em: ${format(new Date(), "Pp", { locale: ptBR })}`
    infoCell.font = { name: "Arial", size: 10, italic: true }
    infoCell.alignment = { horizontal: "right" }

    // Cabeçalhos
    const headers = [
      { header: "Data", key: "periodo", width: 15 }, // Renomeado para Data
      { header: "Nome", key: "nome", width: 25 },
      { header: "Produto", key: "produto", width: 25 },
      { header: "Qtd.", key: "quantidade", width: 10 }, // Abreviado
      { header: "Vlr. Unit.", key: "valorUnitario", width: 15 }, // Abreviado
      { header: "Vlr. Total", key: "valorTotal", width: 15 }, // Abreviado
      { header: "Status Pgto.", key: "statusPagamento", width: 18 }, // Abreviado
    ]
    worksheet.columns = headers

    // Estilizar Cabeçalhos
    const headerRow = worksheet.getRow(3)
    headers.forEach((header, index) => {
      const cell = headerRow.getCell(index + 1)
      cell.value = header.header
      cell.font = {
        name: "Arial",
        size: 12,
        bold: true,
        color: { argb: "FFFFFF" },
      }
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4472C4" },
      }
      cell.alignment = { horizontal: "center", vertical: "middle" }
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
    })
    headerRow.height = 20

    // Adicionar Dados
    data.forEach((item: ConsumoData) => {
      worksheet.addRow({
        periodo: item.periodo, // Mantém o formato dd/MM/yyyy vindo da API
        nome: item.nome,
        produto: item.produto,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        valorTotal: item.valorTotal,
        statusPagamento: item.statusPagamento,
      })
    })

    // Estilizar Células de Dados
    const dataRows = worksheet.getRows(4, data.length)
    dataRows?.forEach((row, index) => {
      const fillColor = index % 2 === 0 ? "F5F5F5" : "FFFFFF"
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        // includeEmpty para aplicar borda em tudo
        const colKey = headers[colNumber - 1]?.key
        cell.font = { name: "Arial", size: 11 }
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

        if (
          colKey === "quantidade" ||
          colKey === "valorUnitario" ||
          colKey === "valorTotal"
        ) {
          cell.alignment = { horizontal: "right" }
        } else if (colKey === "periodo" || colKey === "statusPagamento") {
          cell.alignment = { horizontal: "center" }
        } else {
          cell.alignment = { horizontal: "left" } // Default para nome/produto
        }
      })
    })

    // Formatar Colunas Numéricas
    worksheet.getColumn("valorUnitario").numFmt = '"R$" #,##0.00'
    worksheet.getColumn("valorTotal").numFmt = '"R$" #,##0.00'
    worksheet.getColumn("quantidade").numFmt = "#,##0"
    worksheet.getColumn("periodo").alignment = { horizontal: "center" } // Centralizar data

    // Adicionar Totais
    const totalRowIndex = data.length + 4
    const totalRow = worksheet.getRow(totalRowIndex)
    totalRow.getCell(1).value = "TOTAL"
    totalRow.getCell(1).font = { bold: true, size: 12 }
    totalRow.getCell(6).value = {
      formula: `SUM(F4:F${totalRowIndex - 1})`,
      date1904: false,
    }
    totalRow.getCell(6).font = { bold: true, size: 12 }
    totalRow.getCell(6).numFmt = '"R$" #,##0.00'

    // Estilizar Linha de Total
    totalRow.eachCell({ includeEmpty: true }, (cell) => {
      if (cell.address.startsWith("A") || cell.address.startsWith("F")) {
        // Aplica só nas células com valor/label
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "E0E0E0" },
        }
        cell.border = { top: { style: "thin" }, bottom: { style: "double" } }
      } else {
        // Aplica borda simples nas outras células da linha de total
        cell.border = { top: { style: "thin" }, bottom: { style: "double" } }
      }
    })

    // Rodapé (removido ou ajustado conforme necessidade, o anterior parecia redundante)
    // Se precisar de rodapé, adicione aqui

    // Gerar Arquivo
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const filename = `Consumos_${formatDateRangeForFilename(startDate, endDate)}.xlsx`
    saveAs(blob, filename)

    console.log("Arquivo Excel gerado e download iniciado:", filename)
  } catch (error) {
    console.error("Erro ao gerar arquivo Excel:", error)
    // Re-lança o erro para ser tratado pela função que chamou (handleTrueExport)
    throw new Error("Falha ao gerar o arquivo Excel.")
  }
}
