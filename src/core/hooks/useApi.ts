import { useState, useCallback } from 'react'

export type Data = any | any[] | null

export type DataFetching = { data?: Data; error?: string | null; loading: boolean; originalData?: Data }

type Caller = (...args: any[]) => Promise<any>

type Decorator = (RequestOrResponse: Record<string, any> | any) => Record<string, any>

type UseApiItem = {
  id: string
  caller: Caller
  decorator?: Decorator
  successHandler?: (data: any) => void
  errorHandler?: (data: any) => void
}

const map: Record<string, UseApiItem> = {}

const defaultDataFetching = { loading: false, error: null, data: null }

export const useApi = (
  id: string,
  callerInitial: Caller,
  decoratorIntitial?: Decorator,
  successHandler?: (data: any) => void,
  errorHandler?: (data: any) => void,
// eslint-disable-next-line function-paren-newline
): [(...args: any[]) => Promise<any>, DataFetching] => {
  const [dataFetching, setDataFetching] = useState<DataFetching>(defaultDataFetching)

  // TODO should work the same with useMemo...
  if (!map[id]) {
    map[id] = { id, caller: callerInitial, decorator: decoratorIntitial, successHandler, errorHandler }
  }

  const { caller, decorator, successHandler: onSuccess, errorHandler: onError } = map[id]

  const doCall: () => Promise<any> = useCallback(async(...args: any[]) => {
    try {
      setDataFetching((prevState: DataFetching) => ({ ...prevState, loading: true }))
      const data: Data = await caller(...args)
      const returnData = decorator ? decorator(data) : data
      onSuccess && onSuccess({ data: returnData, originalData: data.data })
      setDataFetching((prevState: DataFetching) => {
        const newState = { ...prevState, loading: false, error: null, data: returnData, originalData: data.data }
        return newState
      })
      return returnData
    } catch (error: any) {
      onError && onError(error)
      setDataFetching((prevState: DataFetching) => ({ ...prevState, loading: false, error }))
      throw error
    }
  }, [caller, decorator, onSuccess, onError])

  return [doCall, dataFetching]
}
