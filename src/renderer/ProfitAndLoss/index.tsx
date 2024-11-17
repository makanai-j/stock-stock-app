import { useEffect, useMemo, useState } from 'react'

import { OtherCharts } from './components/OtherCharts'
import { PnLChart } from './components/PnLCharts'
import { PnLHeader } from './components/PnLHeader'
import { PnLList } from './components/PnLList'
import {
  EChartsOptionProvider,
  useEChartsOption,
  useEChartsOptionDispatch,
} from './EChartsOptionContext'
import { aggregateTradePnL } from './hooks/aggregateTradePnL'
import { findIntervalPnLByDate } from './hooks/findIntervalPnLByDate'
import { getPnL } from './hooks/getPnL'
//import { PnLProvider } from './PnLContext'
import './index.css'

export const GainAndLoss = () => {
  return (
    <>
      <EChartsOptionProvider>
        <GainAndLossChild />
      </EChartsOptionProvider>
    </>
  )
}

const GainAndLossChild = () => {
  const [showList, setShowList] = useState(false)
  const [tradePnLs, setTradePnLs] = useState<TradeRecordPnL[]>([])
  const eChartsOption = useEChartsOption()
  const eChartsDispatch = useEChartsOptionDispatch()

  useEffect(() => {
    window.crudAPI
      .select({ mode: 'PnL' })
      .then((trades) => {
        // 全損益
        setTradePnLs(trades)
        if (trades.length) {
          eChartsDispatch &&
            eChartsDispatch({
              type: 'setDate',
              date: new Date(trades[trades.length - 1].date),
            })
        }
      })
      .catch((e) => console.log(e))
  }, [])

  const toggleShowList = () => {
    setShowList(!showList)
  }

  /** 選択された間隔とその間隔に合わせた期間でまとめた損益 */
  const groupedByPeriodPnL = useMemo(
    () =>
      eChartsOption ? aggregateTradePnL(eChartsOption.interval, tradePnLs) : [],
    [tradePnLs, eChartsOption?.interval]
  )

  /** 選択された日を含んでいる機関の損益 */
  const getSelectedTradePnLs = (): TradeRecordPnL[][] => {
    if (!tradePnLs || !eChartsOption) return []
    return findIntervalPnLByDate(
      groupedByPeriodPnL,
      eChartsOption.date,
      eChartsOption.interval
    )
  }
  const { selectedTradePnLs, periodPnL } = useMemo(() => {
    const stp = getSelectedTradePnLs()
    let pPnL = 0
    for (let i = 0; i < stp.length; i++) {
      for (let j = 0; j < stp[i].length; j++) {
        pPnL += getPnL(stp[i][j])
      }
    }
    return { selectedTradePnLs: stp, periodPnL: pPnL }
  }, [tradePnLs, eChartsOption])

  const totalPnL = useMemo(() => {
    if (!tradePnLs) return 0
    let total = 0
    for (let i = 0; i < tradePnLs.length; i++) {
      total += getPnL(tradePnLs[i])
    }
    return total
  }, [tradePnLs])

  return (
    <>
      <PnLHeader toggle={toggleShowList} />
      <div
        className={`pnl-list-container ${showList ? 'pnl-list-container-show' : 'pnl-list-container-hidden'}`}
      >
        <PnLList tradePnLs={selectedTradePnLs} />
      </div>
      <div style={{ display: 'flex' }}>
        <div className="pnl-summary no-wrap other-size-height">
          <h3>総合損益</h3>
          <div>{totalPnL}円</div>
          <h3>期間損益</h3>
          <div>{periodPnL}円</div>
        </div>
        <OtherCharts tradePnLs={selectedTradePnLs} />
      </div>
      <PnLChart groupedByPeriodPnL={groupedByPeriodPnL}></PnLChart>
    </>
  )
}
