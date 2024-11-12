import { AddRecordBar } from './components/AddRecordBar'
import {
  InputTradesProvider,
  useInputTrades,
  useInputTradesDispatch,
} from './InputTradesContext'
import { useState } from 'react'
import { QuarterPicker } from 'renderer/MyMui/QuarterPicker'
import { BaseDatePicker } from 'renderer/MyMui/BaseDatePicker'
import { MyDateTimePicker } from 'renderer/MyMui'

export const InputTrades = () => {
  return (
    <>
      <InputTradesProvider>
        <NewAddChild></NewAddChild>
      </InputTradesProvider>
    </>
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
        window.crudAPI.select({ mode: 'raw' }).then((data) => {
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
      <QuarterPicker />
      <MyDateTimePicker format="YYYY/M/D H:m" />
      <BaseDatePicker
        format="YYYY/M"
        formatDensity="spacious"
        views={['year', 'month']}
        slotProps={{
          calendarHeader: { format: 'YYYY/M' },
        }}
      />
      <BaseDatePicker
        format="YYYY"
        formatDensity="spacious"
        closeOnSelect={true}
        // calendar header を表示するために2つ入れる
        views={['year', 'year']}
        slotProps={{
          calendarHeader: { format: 'YYYY' },
        }}
      />
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
