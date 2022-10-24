export const cleanCsvLines = (data:string): string => {
  if (!data || !data.length) {
    return data
  }

  let lineDelimiter = '\r\n'
  let lines: string[] = data.split(lineDelimiter)

  if (lines.length <= 1) {
    lineDelimiter = '\n'
    lines = data.split(lineDelimiter)
  }

  let linesNum = lines.length

  // eslint-disable-next-line no-cond-assign
  // eslint-disable-next-line no-plusplus
  while (linesNum--) {
    if (lines[linesNum].trim() === '' || lines[linesNum].split(';').join('').trim() === '') {
      lines.splice(linesNum, 1)
    }
  }
  return lines.join(lineDelimiter)
}

export const formatFilePath = (filePath?: string): string | undefined => filePath?.split('/')?.pop()
