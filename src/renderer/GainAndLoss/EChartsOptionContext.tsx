import { createContext, useContext, useReducer, Dispatch } from 'react'

type EChartsAction =
  | { type: 'setInterval'; interval: GALInterval }
  | { type: 'setDate'; date: Date }
type EChartsOption = { interval: GALInterval; date: Date }
const EChartsOptionContext = createContext<EChartsOption | null>(null)
const EChartsOptionDispachContext =
  createContext<Dispatch<EChartsAction> | null>(null)

export function EChartsOptionProvider({ children }: { children: any }) {
  const [inputTrades, dispach] = useReducer(EChartsOptionReducer, {
    date: new Date(),
    interval: '1d',
  })

  return (
    <div>
      <EChartsOptionContext.Provider value={inputTrades}>
        <EChartsOptionDispachContext.Provider value={dispach}>
          {children}
        </EChartsOptionDispachContext.Provider>
      </EChartsOptionContext.Provider>
    </div>
  )
}

export const useEChartsOption = () => useContext(EChartsOptionContext)
export const useEChartsOptionDispatch = () =>
  useContext(EChartsOptionDispachContext)

function EChartsOptionReducer(
  option: EChartsOption,
  action: EChartsAction
): EChartsOption {
  switch (action.type) {
    case 'setDate':
      return { ...option, date: action.date }
    case 'setInterval':
      return { ...option, interval: action.interval }
  }
}
