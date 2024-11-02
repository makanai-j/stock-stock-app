import { set } from 'lodash'
import { useEffect, useState } from 'react'

export const HistoryList = ({ option, dispach }: { option: SlectFilterOptions, dispach: (tradeId: string) => void }) => {
  const [trades, setTrades] = useState<TradeRecordFull[]>([])
  useEffect(() => {
  window.crudAPI.select(option).then((trades) => setTrades(trades))
  })

  return (
    <div>
      {trades.map((trade) => (
        <div onClick={() => dispach(trade.id)} key={trade.id}>
          <span>{formatToTime(trade.date)}</span>
          <span>{trade.symbol}</span>
          <span>{trade.company}</span>
          <span>{trade.tradeType}</span>
          <span>{trade.quantity}株</span>
          <span>{trade.price}円</span>
        </div>
      ))}
    </div>
  )
}

const formatToTime = (date: Date | number | string) => {
  date = new Date(date)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}
