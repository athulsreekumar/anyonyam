import { describe, expect, it, vi } from 'vitest'

vi.mock('file-saver', () => ({ saveAs: vi.fn() }))

const { saveAs } = await import('file-saver')
const { exportToExcel } = await import('./exportExcel')

describe('exportToExcel', () => {
  it('saves a workbook named with the given filename plus .xlsx', async () => {
    await exportToExcel([{ Name: 'Krishnan', MemberNo: 3 }], 'members_export')
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'members_export.xlsx')
  })

  it('handles an empty row set without throwing', async () => {
    await expect(exportToExcel([], 'empty_export')).resolves.toBeUndefined()
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'empty_export.xlsx')
  })
})
