import { getDayCustom } from './getDayCustom'
import { isInSameShortPeriod, isInSameLongPeriod } from './isInSamePeriod'

/**
 * 指定された間隔に応じて配列にする。
 * さらにそこから、より長い間隔で配列にする。
 * @param interval データの間隔
 * @param trades 損益データ
 * @returns 損益データを成形したもの
 *
 * *
 * 指定インターバルの配列をまとめる間隔
 * @interval 1d - 月
 * @interval 1wk - 四半期
 * @interval 1mo - 年
 * @interval 1y - 全期間
 */
export const aggregateTradeGAL = (
  interval: GALInterval,
  trades: TradeRecordGAL[]
): TradeRecordGAL[][][] => {
  if (!trades.length) return []

  const galGroupedByPeriod: TradeRecordGAL[][] = []
  let currentGroup: TradeRecordGAL[] = [trades[0]]

  for (let i = 1; i < trades.length; i++) {
    // 前のデータと同じ指定間隔内であれば同じ配列に追加
    if (
      isInSameShortPeriod(
        interval,
        new Date(trades[i - 1].date),
        new Date(trades[i].date)
      )
    ) {
      currentGroup.push(trades[i])
    } else {
      galGroupedByPeriod.push(currentGroup)
      currentGroup = [trades[i]]
    }
  }
  // 最後の配列を追加
  galGroupedByPeriod.push(currentGroup)

  const galGroupedByLongPeriod: TradeRecordGAL[][][] = []
  let longPeriodGroup: TradeRecordGAL[][] = [galGroupedByPeriod[0]]

  for (let i = 1; i < galGroupedByPeriod.length; i++) {
    const prevDate = new Date(galGroupedByPeriod[i - 1][0].date)
    const currDate = new Date(galGroupedByPeriod[i][0].date)
    if (interval == '1w') {
      prevDate.setDate(prevDate.getDate() - getDayCustom(prevDate))
      currDate.setDate(currDate.getDate() - getDayCustom(currDate))
    }
    // より長い間隔で前後データの日付を確認
    const isSamePeriod = isInSameLongPeriod(interval, prevDate, currDate)

    // より長い間隔内にどちらも存在していれば同じ配列へ
    if (isSamePeriod) {
      longPeriodGroup.push(galGroupedByPeriod[i])
    } else {
      galGroupedByLongPeriod.push(longPeriodGroup)
      longPeriodGroup = [galGroupedByPeriod[i]]
    }
  }
  // 最後の配列を追加
  galGroupedByLongPeriod.push(longPeriodGroup)

  return galGroupedByLongPeriod
}
