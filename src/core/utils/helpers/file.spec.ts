/* eslint-disable max-len */
import { cleanCsvLines } from './file'

const testData = `
TubeID;Arrival;Arrival rack ID;Arrival time;Disease;Detection kit;Position PCR;Analysis type;Channel 1;Channel 2;Channel 3;Channel 4;Channel 5;Result;Detailed result;Variant;Channel 1 gene;Channel 2 gene;Channel 3 gene;Channel 4 gene;Channel 5 gene
hTQtest557;not in database;DSR-014;2021-06-20 15:29;COVID-19;DB-1219;;;;;;;;;;;;;;;
hTQtest558;YES;DSR-014;2021-06-20 15:29;COVID-19;DB-1219;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;

`

describe('cleanCsvLines', () => {
  it('should clean empty lines', () => {
    const str = testData
    const data = cleanCsvLines(str)

    let lineDelimiter = '\r\n'
    let lines: string[] = data.split(lineDelimiter)

    if (lines.length <= 1) {
      lineDelimiter = '\n'
      lines = data.split(lineDelimiter)
    }

    expect(lines.length).toEqual(3)
  })
})
