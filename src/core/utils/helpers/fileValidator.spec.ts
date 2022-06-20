import { parseCSVdata, validateCSVlines, validateLineCellTrimmed, validateLineNumColumns } from './fileValidator'

describe('csvFileValidator', () => {
  describe('parseCSVdata fnc', () => {
    const dataMock = 'Name;Surname\n'
      + '↵Prokop;Buben\n'
      + '↵Tomas;Marny'

    const resultMock = {
      firstLine: 'Name;Surname',
      lines: ['Prokop;Buben', 'Tomas;Marny'],
      columns: ['Name', 'Surname'],
      numColumns: 2,
    }

    const testResult = parseCSVdata(dataMock)

    it('should return the right firstline', () => {
      expect(testResult.firstLine).toEqual(resultMock.firstLine)
    })

    it('should return the right lines', () => {
      expect(testResult.lines).toEqual(expect.arrayContaining([
        expect.stringContaining(resultMock.lines[0]),
        expect.stringContaining(resultMock.lines[1]),
      ]))
    })

    it('should return the right columns', () => {
      expect(testResult.columns).toEqual(expect.arrayContaining([
        expect.stringContaining(resultMock.columns[0]),
        expect.stringContaining(resultMock.columns[1]),
      ]))
    })

    it('should return the right number of columns', () => {
      expect(testResult.numColumns).toEqual(resultMock.numColumns)
    })

    it('should return the right number of properties', () => {
      expect(Object.keys(testResult).length).toEqual(Object.keys(resultMock).length)
    })
  })

  describe('validateCSVlines fnc', () => {
    let linesMock = []
    const numColumnsMock = 2

    let testResult = null

    it('should return an array', () => {
      linesMock = ['Prokop;Buben', 'Tomas;Marny']
      testResult = validateCSVlines(linesMock, numColumnsMock)
      expect(Array.isArray(testResult)).toBeTruthy()
    })

    it('should return no error message', () => {
      linesMock = ['Prokop;Buben', 'Tomas;Marny']
      testResult = validateCSVlines(linesMock, numColumnsMock)
      expect(testResult.length === 0).toBeTruthy()
    })

    it('should return exactly two items', () => {
      linesMock = ['Prokop', 'Tomas;Marny ']
      testResult = validateCSVlines(linesMock, numColumnsMock)
      expect(testResult.length).toEqual(2)
    })

    it('should return an error object (invalid column size)', () => {
      linesMock = ['Prokop', 'Tomas;Marny']
      testResult = validateCSVlines(linesMock, numColumnsMock)

      const errorMock = {
        message: 'errors.uploadInput.file.line.invalid',
        params: {
          line: 'Prokop', index: 1,
        },
      }

      expect(Array.isArray(testResult)).toBeTruthy()
      expect(testResult.length).toEqual(1)
      expect(testResult).toEqual(expect.arrayContaining([expect.objectContaining(errorMock)]))
    })

    it('should return an error object (invalid cell format)', () => {
      linesMock = ['Prokop;Buben', 'Tomas;Marny ']
      testResult = validateCSVlines(linesMock, numColumnsMock)

      const errorMock = {
        message: 'errors.uploadInput.file.cell.invalid',
        params: {
          line: 'Tomas;Marny ', cell: 'Marny ', lineIndex: 1, cellIndex: 1,
        },
      }

      expect(Array.isArray(testResult)).toBeTruthy()
      expect(testResult.length).toEqual(1)
      expect(testResult).toEqual(expect.arrayContaining([expect.objectContaining(errorMock)]))
    })
  })

  describe('validateLineNumColumns fnc', () => {
    it('should return the right error object', () => {
      const errorMock = {
        message: 'errors.uploadInput.file.line.invalid',
        params: { line: 'Prokop;Buben', index: 2 },
      }

      expect(validateLineNumColumns(['Name', 'Surname'], 5, 'Prokop;Buben', 1)).toEqual(errorMock)
    })
  })

  describe('validateLineCellTrimmed fnc', () => {
    it('should return the right error object', () => {
      const errorMock = {
        message: 'errors.uploadInput.file.cell.invalid',
        params: {
          line: 'Name;Surname', cell: 'Name ', lineIndex: 1, cellIndex: 1,
        },
      }

      expect(validateLineCellTrimmed('Name ', 'Name;Surname', 1, 1)).toEqual(errorMock)
    })
  })
})
