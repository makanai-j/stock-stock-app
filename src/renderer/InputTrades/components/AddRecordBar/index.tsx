import { useState } from 'react'
import './index.css'
import { useInputTradesDispatch } from 'renderer/InputTrades/InputTradesContext'
import HashStr from 'renderer/InputTrades/hooks/Hash11'

export const AddRecordBar = ({
  trade,
  index,
}: {
  trade: TradeRecord
  index: number
}) => {
  const dispach = useInputTradesDispatch()
  //const [trade, setTrade] = useState(initializedTrade)
  return (
    <div className="add-record-bar">
      <button
        onClick={() =>
          dispach &&
          dispach({ type: 'push', trade: { ...trade, id: HashStr.randCode() } })
        }
      >
        +
      </button>
      <button
        onClick={() => dispach && dispach({ type: 'delete', id: trade.id })}
      >
        -
      </button>

      {/** datetime */}
      <ShowOnFirstIndex text={formatToDateTime(trade.date)} index={index}>
        <input
          type="datetime-local"
          value={formatToDateTime(trade.date)}
          onChange={(e) =>
            dispach &&
            dispach({
              type: 'update',
              trade: { ...trade, date: e.target.value },
            })
          }
        />
      </ShowOnFirstIndex>

      {/** symbol */}
      <ShowOnFirstIndex text={trade.symbol} index={index}>
        <input
          type="text"
          maxLength={4}
          value={trade.symbol}
          onChange={(e) =>
            dispach &&
            dispach({
              type: 'update',
              trade: { ...trade, symbol: e.target.value },
            })
          }
        ></input>
      </ShowOnFirstIndex>
      {/** tradetype */}
      <ShowOnFirstIndex text={trade.tradeType} index={index}>
        <select
          value={trade.tradeType}
          onChange={(e) =>
            dispach &&
            dispach({
              type: 'update',
              trade: { ...trade, tradeType: e.target.value },
            })
          }
        >
          {[
            '現物買',
            '現物売',
            '信用新規買',
            '信用新規売',
            '信用返済買',
            '信用返済売',
          ].map((type, index) => (
            <option value={type} key={index}>
              {type}
            </option>
          ))}
        </select>
      </ShowOnFirstIndex>
      {/** quantity */}
      <input
        type="number"
        value={trade.quantity}
        step={100}
        min={100}
        onChange={(e) =>
          dispach &&
          dispach({
            type: 'update',
            trade: { ...trade, quantity: Number(e.target.value) },
          })
        }
      ></input>
      {/** price fee tax */}
      {['price', 'fee', 'tax'].map((field) => (
        <input
          key={field}
          type="number"
          value={trade[field as keyof TradeRecord] as number}
          onChange={(e) =>
            dispach &&
            dispach({
              type: 'update',
              trade: { ...trade, [field]: Number(e.target.value) },
            })
          }
        />
      ))}
      {/** holdtype */}
      <ShowOnFirstIndex text={trade.holdType} index={index}>
        <select
          value={trade.holdType}
          onChange={(e) =>
            dispach &&
            dispach({
              type: 'update',
              trade: { ...trade, holdType: e.target.value },
            })
          }
        >
          {['一般', '特定', 'NISA'].map((type, index) => (
            <option value={type} key={index}>
              {type}
            </option>
          ))}
        </select>
      </ShowOnFirstIndex>
      <button
        onClick={() =>
          dispach && dispach({ type: 'pushInGroup', id: trade.id })
        }
      >
        g
      </button>
    </div>
  )
}

const formatToDateTime = (date: Date | number | string) => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// コンポーネントをコンポーネント内で定義すると再マウントされて
// inputのフォーカス外れちゃうから気をつけようね！
const ShowOnFirstIndex = ({
  children,
  text,
  index,
}: {
  children: any
  text: string
  index: number
}) => {
  return (
    <div>{index == 0 ? children : <div className="input">{text}</div>}</div>
  )
}
