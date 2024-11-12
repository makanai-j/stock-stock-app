import { useEChartsOption } from 'renderer/GainAndLoss/EChartsOptionContext'
import { useGAL } from 'renderer/GainAndLoss/GALContext'
import { aggregateTradeGAL } from 'renderer/GainAndLoss/hooks/aggregateTradeGAL'
import { findTradesByDate } from '../../hooks/findTradesByDate'

/** 損益リスト */
export const GALList = () => {
  const tradesGAL = useGAL()
  const eChartsOption = useEChartsOption()

  /** 損益データを成形して返す */
  const getGals = () => {
    if (!tradesGAL || !eChartsOption) return []
    const galGroupedByLongPeriod = aggregateTradeGAL(
      eChartsOption.interval,
      tradesGAL
    )
    const galGroupedByPeriod = findTradesByDate(
      galGroupedByLongPeriod,
      eChartsOption.date,
      eChartsOption.interval
    )
    if (!galGroupedByPeriod) return []
    return galGroupedByPeriod.map((groups) => {
      const gal: GAL = {
        gal: 0,
        period1: new Date(groups[0].date),
        period2: new Date(),
      }
      for (const trade of groups) {
        gal.gal += trade.gal * trade.quantity
        gal.period2 = new Date(trade.date)
      }
      return gal
    })
  }
  return (
    <>
      {getGals().map((gal, key) => (
        <div key={key}>
          <span>{gal.gal}</span>
          <br />
          <span>{gal.period1.toString()}</span>~
          <span>{gal.period2.toString()}</span>
        </div>
      ))}
    </>
  )
}
