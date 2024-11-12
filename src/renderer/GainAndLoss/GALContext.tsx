import { createContext, useContext, useReducer, Dispatch } from 'react'

type GALAction = { trade: TradeRecordGAL[] }

const GALContext = createContext<TradeRecordGAL[] | null>(null)
const GALDispachContext = createContext<Dispatch<GALAction> | null>(null)

export function GALProvider({ children }: { children: any }) {
  const [inputTrades, dispach] = useReducer(GALReducer, [] as TradeRecordGAL[])

  return (
    <div>
      <GALContext.Provider value={inputTrades}>
        <GALDispachContext.Provider value={dispach}>
          {children}
        </GALDispachContext.Provider>
      </GALContext.Provider>
    </div>
  )
}

export const useGAL = () => useContext(GALContext)
export const useGALDispatch = () => useContext(GALDispachContext)

function GALReducer(
  tradeGroups: TradeRecordGAL[],
  action: GALAction
): TradeRecordGAL[] {
  return action.trade
}
