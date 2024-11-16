import { useMemo, useState } from 'react'

import { GALChart } from './components/GALCharts'
import { GALHeader } from './components/GALHeader'
import { GALList } from './components/GALList'
import { OtherCharts } from './components/OtherCharts'
import { EChartsOptionProvider, useEChartsOption } from './EChartsOptionContext'
import { GALProvider, useGAL } from './GALContext'
import './index.css'
import { aggregateTradeGAL } from './hooks/aggregateTradeGAL'
import { findTradesByDate } from './hooks/findTradesByDate'

export const GainAndLoss = () => {
  return (
    <>
      <GALProvider>
        <EChartsOptionProvider>
          <GainAndLossChild />
        </EChartsOptionProvider>
      </GALProvider>
    </>
  )
}

const GainAndLossChild = () => {
  const [showList, setShowList] = useState(false)
  const tradesGAL = useGAL()
  const eChartsOption = useEChartsOption()

  const toggleShowList = () => {
    setShowList(!showList)
  }

  /** 損益データを成形して返す */
  const getTradeGals = (): TradeRecordGAL[][] => {
    if (!tradesGAL || !eChartsOption) return []
    const galGroupedByPeriod = findTradesByDate(
      aggregateTradeGAL(eChartsOption.interval, tradesGAL),
      eChartsOption.date,
      eChartsOption.interval
    )
    if (!galGroupedByPeriod) return []
    else return galGroupedByPeriod
  }

  const selectedTradeGals = useMemo(() => getTradeGals(), [eChartsOption])

  return (
    <>
      <GALHeader toggle={toggleShowList} />
      <div
        className={`gal-list-container ${showList ? 'gal-list-container-show' : 'gal-list-container-hidden'}`}
      >
        <GALList tradeGals={selectedTradeGals} />
      </div>
      <OtherCharts tradeGals={selectedTradeGals} />
      <GALChart></GALChart>
    </>
  )
}
