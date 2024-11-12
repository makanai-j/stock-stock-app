import { useEffect, useState } from 'react'
//import { isIntervalString, YFOptions } from '../../types/yfTypes'
import { useTradesHistory, TradesHistoryProvider } from './TradesHistoryContext'
import {
  useYFOptions,
  useYFOptionsDispatch,
  YFOptionsProvider,
} from './YFOptionsContext'
import { FinanceChart } from './components/FinanceCharts'
import { HistoryList } from './components/HistoryList'
import { usableInterval } from './hooks/usableInterval'
import './index.css'
import { TradesInfo } from './components/TradesInfo'

/**
 * 履歴画面のページ
 */
export const TradesHistory = () => {
  return (
    <TradesHistoryProvider>
      <YFOptionsProvider>
        <div
          className="tade-history-container"
          style={{ display: 'flex', width: '100%', overflowX: 'scroll' }}
        >
          <HistoryList></HistoryList>
          <Chart></Chart>
        </div>
      </YFOptionsProvider>
    </TradesHistoryProvider>
  )
}

const Chart = () => {
  const trades = useTradesHistory()
  const yfOptions = useYFOptions()
  const yfOptionsDispatch = useYFOptionsDispatch()

  const period1 = () => (trades?.length ? new Date(trades[0].date) : new Date())
  const period2 = () =>
    trades?.length ? new Date(trades[trades.length - 1].date) : new Date()

  const setIntervalYfOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (trades?.length) {
      yfOptionsDispatch &&
        yfOptionsDispatch({
          type: 'set',
          options: {
            interval: e.target.value as YFInterval,
            period1: period1(),
            period2: period2(),
          },
        })
    }
  }

  return (
    <div>
      {trades?.length ? (
        <div className="charts-outer">
          <TradesInfo trades={trades} />
          <select
            className="interval-select"
            value={yfOptions?.interval}
            onChange={setIntervalYfOption}
          >
            {Object.keys(intervalMap).map(
              (key) =>
                usableInterval<string>(period1(), period2()).includes(key) && (
                  <option value={key} key={key}>
                    {intervalMap[key]}
                  </option>
                )
            )}
          </select>
          <FinanceChart />
        </div>
      ) : (
        <div>no data</div>
      )}
    </div>
  )
}

const intervalMap: Record<string, string> = {
  '1m': '1分',
  '2m': '2分',
  '5m': '5分',
  '15m': '15分',
  '30m': '30分',
  '1h': '1時間足',
  '1d': '日足',
  '1wk': '週足',
  '1mo': '月足',
  '3mo': '四半期足',
}
