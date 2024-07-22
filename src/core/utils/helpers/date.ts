import dayjs from 'dayjs'

export const getDate = (): string => new Date().toString()


export const formatDateToTimestamp = (date = new Date()): string => dayjs(date).format('YYYY-MM-DD HH:mm:ss')

export const DATE_FORMAT = 'MM-DD-YYYY'
export const DATE_TIME_FORMAT = 'MM-DD-YYYY HH-mm-ss'

export const formatDate = (date: string | Date): string => dayjs(date).format(DATE_FORMAT)
export const formatDateTime = (date: string | Date): string => dayjs(date).format(DATE_TIME_FORMAT)

