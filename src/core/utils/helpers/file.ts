export const cleanCsvLines = (data:string): string => {
  if (!data || !data.length) {
    console.log('no data')
    return data
  }

  let lineDelimiter = '\r\n'
  let lines: string[] = data.split(lineDelimiter)

  if (lines.length <= 1) {
    lineDelimiter = '\n'
    lines = data.split(lineDelimiter)
  }

  console.log('lines')
  console.log(lines)

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
  console.log('lines purified')
  console.log(lines)
  console.log(typeof lines.join(lineDelimiter))
  return lines.join(lineDelimiter)
}

export const formatFilePath = (filePath?: string): string | undefined => filePath?.split('/')?.pop()
