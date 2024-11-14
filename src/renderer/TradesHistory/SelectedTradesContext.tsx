import { createContext, useContext, useReducer, Dispatch } from 'react'

type SelectedTradesAction = { type: 'set'; trades: TradeRecordRaw[] }

const SelectedTradesContext = createContext<TradeRecordRaw[] | null>(null)
const SelectedTradesDispachContext =
  createContext<Dispatch<SelectedTradesAction> | null>(null)

function SelectedTradesReducer(
  trades: TradeRecordRaw[],
  action: SelectedTradesAction
): TradeRecordRaw[] {
  switch (action.type) {
    case 'set':
      return action.trades
    default:
      return trades
  }
}

export function SelectedTradesProvider({ children }: { children: any }) {
  const [SelectedTrades, dispach] = useReducer(
    SelectedTradesReducer,
    [] as TradeRecordRaw[]
  )

  return (
    <div>
      <SelectedTradesContext.Provider value={SelectedTrades}>
        <SelectedTradesDispachContext.Provider value={dispach}>
          {children}
        </SelectedTradesDispachContext.Provider>
      </SelectedTradesContext.Provider>
    </div>
  )
}

export const useSelectedTrades = () => useContext(SelectedTradesContext)
export const useSelectedTradesDispatch = () =>
  useContext(SelectedTradesDispachContext)
