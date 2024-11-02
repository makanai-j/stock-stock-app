import HashStr from './hooks/Hash11'
import { AddRecordBar } from './components/AddRecordBar'
import {
  TradesProvider,
  useInputTrades,
  useInputTradesDispatch,
} from './InputTradesContext'
import { useState } from 'react'

export const InputTrades = () => {
  return (
    <div>
      <TradesProvider>
        <NewAddChild></NewAddChild>
      </TradesProvider>
    </div>
  )
}

const NewAddChild = () => {
  const tradeGroups = useInputTrades()
  const dispach = useInputTradesDispatch()
  const [ableInsert, setAbleInsert] = useState(true)

  const flatTrades = () => {
    if (!tradeGroups) return []
    return tradeGroups?.flatMap((trades) => {
      if (!trades.length) return trades
      const headTrade = { ...trades[0] }
      headTrade.price = headTrade.price * headTrade.quantity
      for (let i = 1; i < trades.length; i++) {
        const trade = trades[i]
        headTrade.quantity += trade.quantity
        headTrade.price += trade.price * trade.quantity
        headTrade.fee += trade.fee
        headTrade.tax += trade.tax
      }
      headTrade.price /= headTrade.quantity
      console.log(headTrade)
      return [headTrade]
    })
  }

  const insert = () => {
    if (!ableInsert) return
    setAbleInsert(false)
    window.crudAPI
      .insert(flatTrades())
      .then(() => {
        console.log('insert resolve')
        dispach && dispach({ type: 'reset' })
        setAbleInsert(true)
        window.crudAPI.select({}).then((data) => {
          console.log(data)
        })
      })
      .catch((err) => {
        console.log(err)
        if (err && err.failId) {
          console.log('trade db error')
          setAbleInsert(true)
        }
      })
  }

  return (
    <div>
      {tradeGroups?.map((trades) =>
        trades.map((trade, index) => {
          return (
            <AddRecordBar
              trade={trade}
              index={index}
              key={trade.id}
            ></AddRecordBar>
          )
        })
      )}

      <button onClick={() => dispach && dispach({ type: 'add' })}>
        新規追加
      </button>
      <button onClick={insert}>保存</button>
    </div>
  )
}
