import { createContext, ReactNode } from 'react'

export type IPayload = any

export interface IAppContext {
  walletAddress?: string
  substrateAddress?: string
  walletComponent: ReactNode
  submitTask: { submit: () => string | undefined; isLoading: boolean; isSuccess: boolean }
  payload: IPayload
  setPayload: (payload: IPayload) => void
}

export const AppContext = createContext<IAppContext>(undefined as any)

export function useAppContext() {
  return useContext(AppContext)
}

export function usePayload() {
  const [payload, setPayload] = useState<IPayload>(undefined)
  return {
    payload,
    setPayload: useCallback((payload: IPayload) => {
      delete payload['cover']
      delete payload['name']
      delete payload['price']
      delete payload['workers_count']
      setPayload(payload)
    }, []),
  }
}

export function buildTrackId() {
  const random = new Date().getTime().toString() + Math.round(Math.random() * 100000000).toString()
  return '0x' + (BigInt(random).toString(16) + '000000000000000000000000000000').slice(0, 32)
}
