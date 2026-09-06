import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

/** Builds a single-sheet workbook from an array of flat records and triggers a download. */
export async function exportToExcel(rows: Record<string, unknown>[], filename: string): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Sheet1')

  if (rows.length > 0) {
    sheet.columns = Object.keys(rows[0]!).map((key) => ({ header: key, key }))
    sheet.addRows(rows)
  }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  saveAs(blob, `${filename}.xlsx`)
}
