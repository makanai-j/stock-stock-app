import { useState } from 'react'
import { isIntervalString, YFOptions } from '../../types/yfTypes'
import FinanceChart from './components/finance-charts'

/**
 * 履歴画面のページ
 */
const History = () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const [yfSymbol, setYFSymbol] = useState('5803.T')
  const [yfOption, setYfOption] = useState({
    interval: '5m',
    period1: yesterday,
  } as YFOptions)

  const setIntervalYfOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isIntervalString(e.target.value)) {
      setYfOption({
        ...yfOption,
        interval: e.target.value,
      })
    }
  }

  const setPeriod = (date: Date | string) => {
    setYfOption({
      ...yfOption,
      period1: date,
    })
  }

  return (
    <div>
      <select value={yfSymbol} onChange={(e) => setYFSymbol(e.target.value)}>
        <option value="7203.T">7203.T</option>
        <option value="5803.T">5803.T</option>
        <option value="7012.T">7012.T</option>
      </select>
      <select value={yfOption.interval} onChange={setIntervalYfOption}>
        <option value="5m">5分</option>
        <option value="15m">15分</option>
        <option value="1d">日足</option>
        <option value="1mo">月足</option>
      </select>
      <input
        type="date"
        value={yfOption.period1.toString()}
        onChange={(ev) => setPeriod(ev.target.value)}
      ></input>
      <FinanceChart yfSymbol={yfSymbol} yfOption={yfOption} />
    </div>
  )
}

export default History
