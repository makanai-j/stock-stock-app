import { createContext, useContext, useReducer, Dispatch } from 'react'

type TradesHistoryAction = { type: 'set'; trades: TradeRecordRaw[] }

const TradesHistoryContext = createContext<TradeRecordRaw[] | null>(null)
const TradesHistoryDispachContext =
  createContext<Dispatch<TradesHistoryAction> | null>(null)

function TradesHistoryReducer(
  trades: TradeRecordRaw[],
  action: TradesHistoryAction
): TradeRecordRaw[] {
  switch (action.type) {
    case 'set':
      return action.trades
    default:
      return trades
  }
}

export function TradesHistoryProvider({ children }: { children: any }) {
  const [tradesHistory, dispach] = useReducer(
    TradesHistoryReducer,
    [] as TradeRecordRaw[]
  )

  return (
    <div>
      <TradesHistoryContext.Provider value={tradesHistory}>
        <TradesHistoryDispachContext.Provider value={dispach}>
          {children}
        </TradesHistoryDispachContext.Provider>
      </TradesHistoryContext.Provider>
    </div>
  )
}

export const useTradesHistory = () => useContext(TradesHistoryContext)
export const useTradesHistoryDispatch = () =>
  useContext(TradesHistoryDispachContext)
