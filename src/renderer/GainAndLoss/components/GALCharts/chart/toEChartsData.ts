import { aggregateTradeGAL } from 'renderer/GainAndLoss/hooks/aggregateTradeGAL'
import { findTradesByDate } from 'renderer/GainAndLoss/hooks/findTradesByDate'
import { getGAL } from 'renderer/GainAndLoss/hooks/getGAL'

/**
 * 売り買いのデータをチャート用のデータに成型する
 * @param tradeGALs 売り買いの損益データ
 * @param date 損益を確認したい日付
 * @param interval 損益の間隔
 * @returns 損益チャート用のデータ
 */
export const toEChartsData = (
  tradeGALs: TradeRecordGAL[],
  date: Date,
  interval: GALInterval
): EChartsDataGAL => {
  /** 総損益 */
  let total = 0

  const eChartsData: EChartsDataGAL = {
    xAxisData: [],
    xAxisData0: [],
    xAxisData1: [],
    yAxisData: [],
    yAxisData0: [],
  }

  const galGroupedByLongPeriod = aggregateTradeGAL(interval, tradeGALs)

  for (let i = 0; i < galGroupedByLongPeriod.length; i++) {
    /** 指定された間隔でまとめた配列 */
    const tradesGroup = galGroupedByLongPeriod[i]

    // 指定された日付を含んでいるか確認
    const t = findTradesByDate([tradesGroup], date, interval)
    // 指定された日付が含まれていれば
    if (t) {
      const formatMap: { [key in GALInterval]: Intl.DateTimeFormatOptions } = {
        '1d': { day: 'numeric' },
        '1w': { month: 'numeric', day: 'numeric' },
        '1mo': { month: 'numeric' },
        '1y': { year: 'numeric' },
      }
      const formatMap0: { [key in GALInterval]: Intl.DateTimeFormatOptions } = {
        '1d': { year: 'numeric', month: 'short', day: 'numeric' },
        '1w': { year: 'numeric', month: 'short', day: 'numeric' },
        '1mo': { year: 'numeric', month: 'short' },
        '1y': { year: 'numeric' },
      }

      const format = formatMap[interval]
      const format0 = formatMap0[interval]
      eChartsData.yAxisData = []

      tradesGroup.forEach((trades, index) => {
        /** 間隔内の経過損益 */
        let periodTotal = 0
        trades.forEach((trade) => (periodTotal += getGAL(trade)))

        const tradeDate = new Date(trades[0].date)
        eChartsData.xAxisData.push(
          tradeDate.toLocaleDateString('ja-JP', format0)
        )

        eChartsData.xAxisData0.push(tradeDate.toLocaleDateString('en', format))

        if (
          interval == '1w' &&
          (index == 0 ||
            new Date(tradesGroup[index - 1][0].date).getMonth() !=
              tradeDate.getMonth())
        ) {
          eChartsData.xAxisData1.push('1')
        } else {
          eChartsData.xAxisData1.push('')
        }

        total += periodTotal
        eChartsData.yAxisData.push(total)
        eChartsData.yAxisData0.push(periodTotal)
      })
    } else {
      if (date < new Date(tradesGroup[0][0].date)) break

      tradesGroup.forEach((trades) =>
        trades.forEach((trade) => (total += getGAL(trade)))
      )

      // 指定日を含むデータがなければ、指定日までの総損益を表示
      eChartsData.yAxisData = [total, total]
    }
  }

  return eChartsData
}
