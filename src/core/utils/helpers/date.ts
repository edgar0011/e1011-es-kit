import dayjs from 'dayjs'

export const getDate = (): string => new Date().toString()
export const DATE_FORMAT = 'MM-DD-YYYY HH-mm'

export const formatDateToTimestamp = (date = new Date()): string => dayjs(date).format('YYYY-MM-DD HH:mm:ss')
