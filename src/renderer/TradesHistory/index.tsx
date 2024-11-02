import { useEffect, useState } from 'react'
//import { isIntervalString, YFOptions } from '../../types/yfTypes'
import {FinanceChart} from './components/FinanceCharts'
import { HistoryList } from './components/HistoryList'

/**
 * 履歴画面のページ
 */
export const TradesHistory = () => {
  const [selectTrades, setSelectTrades] = useState<TradeRecordFull[]>([])

  const setChartTrades = (tradeId: string) => {
    window.crudAPI.select({id: tradeId}).then(trades => {
      console.log(trades)
      setSelectTrades(trades)
    })
  }

  return (
    <>
    {selectTrades.length > 1 && <Chart trades={selectTrades}></Chart>}
    <HistoryList option={{}}  dispach={setChartTrades}></HistoryList>
    </>
  )
}


const Chart = ({trades}: {trades: TradeRecordFull[]}) => {
  
  if (!trades.length) return 

  let period1 = new Date(trades[0].date)
  let period2 = new Date(trades[0].date)




    const chartTrades = trades.sort((a, b) => {
      if (a.date < b.date) return -1
      else if (a.date > b.date) return 1
      return 0
     })
     if (chartTrades.length > 1) {
       period1 = new Date(chartTrades[0].date)
       period2 = new Date(chartTrades[chartTrades.length - 1].date)
     } else if (chartTrades.length == 1) {
       period1.setDate(period1.getDate() - 1)
       period2.setDate(period2.getDate() + 1)
     }

  console.log(period1, period2)

  const demo = new Date()
  const demo1 = demo.setDate(demo.getDate() - 20)
    const [yfOption, setYfOption] = useState<YFOptions>({
      interval: '5m',
      period1: period1,
      period2: period2,
    })
  
  

  const setIntervalYfOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYfOption({
      ...yfOption,
      interval: e.target.value as interval,
    })
  }

  return (
    <div>
      <select value={yfOption.interval} onChange={setIntervalYfOption}>
        <option value="5m">5分</option>
        <option value="15m">15分</option>
        <option value="1d">日足</option>
        <option value="1mo">月足</option>
      </select>
      <FinanceChart yfSymbol={`${trades[0].symbol}${trades[0].placeYF}`} yfOption={yfOption} />
    </div>
  )
}

const Chart1 = async ({trades}: {trades: [TradeRecordFull, ...TradeRecordFull[]]}) => {
  const sortedTrades = trades.sort((a, b) => {
    if (a.date < b.date) return 1
    else if (a.date > b.date) return -1
    return 0
   })
  let period1: string | number | Date = new Date(trades[0].date)
  let period2: string | number | Date = new Date(trades[0].date)
  if (trades.length > 1) {
    period1 = sortedTrades[0].date
    period2 = sortedTrades[trades.length - 1].date
  } else {
    period1.setDate(period1.getDate() - 1)
    period2.setDate(period2.getDate() + 1)
  }
  const [yfOption, setYfOption] = useState({
    interval: '5m',
    period1: period1,
    period2: period2,
  } as YFOptions)

  const setIntervalYfOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYfOption({
      ...yfOption,
      interval: e.target.value as interval,
    })
  }

  return (
    <div>
      <select value={yfOption.interval} onChange={setIntervalYfOption}>
        <option value="5m">5分</option>
        <option value="15m">15分</option>
        <option value="1d">日足</option>
        <option value="1mo">月足</option>
      </select>
      <FinanceChart yfSymbol={`${trades[0].symbol}${trades[0].placeYF}`} yfOption={yfOption} />
    </div>
  )
}