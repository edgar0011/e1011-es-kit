import { fileNameExt } from './textValueOperations'

export const parseCSVdata = (data: string, columnDelimiter = ';'): {
  firstLine: string
  lines: string[]
  columns: null | string[]
  numColumns: number
} => {
  let lines: string[] = data.split('\r\n')
  if (lines.length <= 1) {
    lines = data.split('\n')
  }
  console.log('lines')
  console.log(lines)

  const firstLine: string = lines.shift() as string
  const columns: null | string[] = firstLine ? firstLine.split(columnDelimiter) : null
  const numColumns: number = columns ? columns.length : 0

  return {
    firstLine,
    lines,
    columns,
    numColumns,
  }
}

export const validateLineNumColumns
  = (lineColumns: Array<string>, numColumns: number, line: string, index: number): ErrorMessage | null => {
    if (lineColumns.length !== numColumns) {
      console.log('numColumns', numColumns)
      console.log('line', line)
      console.log('lineColumns', lineColumns)
      // errors.push(`Line number of cells is not equal to the number of columns: "${line}, index: ${index}"`)
      return {
        message: 'errors.uploadInput.file.line.invalid',
        params: { line, index: index + 1 } } as ErrorMessage
    }
    return null
  }

export const validateLineCellTrimmed
  = (cell: string, line: string, lineIndex: number, cellIndex: number): ErrorMessage | null => {
    if (cell !== cell.trim()) {
      console.log('TRIM CELL')
      console.log(`cell:[${cell}]`)
      console.log(`cell.trim():[${cell.trim()}]`)
      return {
        message: 'errors.uploadInput.file.cell.invalid',
        params: {
          line, cell, lineIndex, cellIndex,
        },
      } as ErrorMessage
    }
    return null
  }

export const validateCSVlines = (lines: string[], numColumns: number, columnDelimiter = ';'): ErrorMessage[] => {
  const errors: ErrorMessage[] = []
  // lines without first line of columns (hence the index + 1 in error message)
  let linesNum = lines.length
  // eslint-disable-next-line no-cond-assign
  // eslint-disable-next-line no-plusplus
  while (linesNum--) {
    console.log('lines[linesNum].trim()')
    console.log(lines[linesNum].trim())

    console.log("lines[linesNum].split(';').join('').trim()")
    console.log(lines[linesNum].split(';').join('').trim())
    if (lines[linesNum].trim() === '' || lines[linesNum].split(';').join('').trim() === '') {
      lines.splice(linesNum, 1)
    }
  }

  console.log('PURIFIED:', lines)

  let lineColumns = null
  let errorLineNumColumns = null
  let errorLineCellNotTrimmed = null
  lines.forEach((line, index) => {
    lineColumns = line.split(columnDelimiter)

    errorLineNumColumns = validateLineNumColumns(lineColumns, numColumns, line, index)
    errorLineNumColumns && errors.push(errorLineNumColumns)

    lineColumns.forEach((cell, cellIndex) => {
      errorLineCellNotTrimmed = validateLineCellTrimmed(cell, line, index, cellIndex)
      errorLineCellNotTrimmed && errors.push(errorLineCellNotTrimmed)
    })
  })

  return errors
}

/*
// maybe add aditional mime types
http://fileformats.archiveteam.org/wiki/CSV
['text/csv','application/csv', 'text/x-csv',
'application/x-csv', 'text/x-comma-separated-values', 'text/comma-separated-values']
*/

export type ErrorMessage = {
  message: string
  params: Record<string, string | number>
}

export const validateCSVFile
= (file: File, callBack: (errors?: (ErrorMessage | string)[] | null) => void, columnDelimiter = ';'): void => {
  if (!file) {
    callBack(['errors.uploadInput.file.empty'])
    return
  }
  if (fileNameExt(file.name) !== 'csv' || !['text/csv', 'text/plain', 'application/vnd.ms-excel'].includes(file.type)) {
    console.log('File invalid')
    console.log(file)
    console.log(file.type)
    callBack(['errors.uploadInput.file.invalid'])
    return
  }
  const reader = new FileReader()
  reader.readAsText(file)
  reader.onloadend = () => {
    const data = reader.result ? reader.result.toString() : ''
    console.log('on File read end')
    console.log('reader', reader)
    console.log('reader.result', reader.result)

    const { numColumns, lines } = parseCSVdata(data, columnDelimiter)

    if (numColumns < 2) {
      callBack(['errors.uploadInput.file.numColumns'])
      return
    }

    if (lines?.length < 1) {
      callBack(['errors.uploadInput.file.numLines'])
      return
    }

    const errors: (ErrorMessage | string)[] = validateCSVlines(lines, numColumns, columnDelimiter)

    const flatErrors: string[] = errors.map((errorMsg: ErrorMessage | string) => (
      (errorMsg as ErrorMessage)?.message ? JSON.stringify(errorMsg) : String(errorMsg)))

    console.log('flatErrors')
    console.log(flatErrors)

    const errorsArray: string[] = [...new Set(flatErrors)].map((serialized: string) => JSON.parse(serialized))

    // callBack && callBack(errorsArray.length ? errorsArray?.splice?.(0, 6) : null)
    callBack && callBack(errorsArray.length ? errorsArray : null)
  }

  reader.onerror = (error) => {
    console.log('File read error')
    console.log(error)
  }
}
