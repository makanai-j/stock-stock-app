import { dialog } from 'electron'
import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'
import * as Encoding from 'encoding-japanese'
import iconv from 'iconv-lite'

/**
 * csvファイルを読み込んで配列へパース
 *
 * @returns csvファイルデータの配列
 */
export const csvFileRead = async (): Promise<any> => {
  const { canceled, filePaths } = await dialog.showOpenDialog({})
  if (!canceled) {
    const csvBuffer = readFileSync(filePaths[0])
    const codeType: string | boolean = Encoding.detect(csvBuffer)
    if (typeof codeType == 'string') {
      const utf8CsvData = iconv.decode(csvBuffer, codeType, {
        addBOM: false,
      })
      const utf8Array = utf8CsvData.split('\n')
      const csvArray: any = parse(iconv.encode(utf8Array.join('\n'), 'UTF8'), {
        relax_column_count: true,
      })
      if (csvArray[0] == undefined)
        throw new Error('Failed to convert to csv file!!')
      return csvArray
    } else {
      throw new Error('Failed to convert to csv file!!')
    }
  } else {
    throw new Error('File selection canceled!!')
  }
}
