import { createContext, useContext, useReducer, Dispatch } from 'react'
import HashStr from './hooks/Hash11'

const InputTradesContext = createContext<TradeRecord[][] | null>(null)

const InputTradesDispachContext = createContext<Dispatch<any> | null>(null)

export function TradesProvider({ children }: { children: any }) {
  const [inputTrades, dispach] = useReducer(
    InputTradesReducer,
    [] as TradeRecord[][]
  )

  return (
    <div>
      <InputTradesContext.Provider value={inputTrades}>
        <InputTradesDispachContext.Provider value={dispach}>
          {children}
        </InputTradesDispachContext.Provider>
      </InputTradesContext.Provider>
      <button onClick={() => console.log(inputTrades)}>log</button>
    </div>
  )
}

export const useInputTrades = () => useContext(InputTradesContext)
export const useInputTradesDispatch = () =>
  useContext(InputTradesDispachContext)

function InputTradesReducer(
  tradeGroups: TradeRecord[][],
  action: any
): TradeRecord[][] {
  switch (action.type) {
    case 'push':
      return [...tradeGroups, [action.trade]]
    case 'pushInGroup':
      return tradeGroups.map((trades) => {
        return trades.flatMap((trade) => {
          if (trade.id != action.id) return trade
          return [trade, { ...trade, id: HashStr.randCode() }]
        })
      })
    case 'add':
      return [...tradeGroups, [initializeTrade()]]
    case 'delete':
      return tradeGroups
        .map((trades) => {
          return trades.filter((trade) => {
            return trade.id !== action.id
          })
        })
        .filter((trades) => trades.length)
    case 'update':
      return tradeGroups.map((trades) => {
        if (trades.map((trade) => trade.id).includes(action.trade.id)) {
          return trades.map((trade) => {
            if (trade.id == action.trade.id) return action.trade
            return {
              ...trade,
              date: action.trade.date,
              symbol: action.trade.symbol,
              tradeType: action.trade.tradeType,
              holdType: action.trade.holdType,
            }
          })
        }
        return trades
      })
    case 'reset':
      return []
  }
  return tradeGroups
}

const initializeTrade = (): TradeRecord => {
  return {
    id: HashStr.randCode(),
    date: new Date(),
    symbol: '',
    tradeType: '現物買',
    holdType: '一般',
    quantity: 100,
    price: 0,
    fee: 0,
    tax: 0,
  }
}
