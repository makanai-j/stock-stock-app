import { GALProvider, useGAL } from './GALContext'
import { GALList } from './components/GALList'
import { GALChart } from './components/GALCharts'
import { EChartsOptionProvider, useEChartsOption } from './EChartsOptionContext'
import { GALHeader } from './components/GALHeader'
import './index.css'
import { useMemo, useState } from 'react'
import { OtherCharts } from './components/OtherCharts'
import { findTradesByDate } from './hooks/findTradesByDate'
import { aggregateTradeGAL } from './hooks/aggregateTradeGAL'

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
