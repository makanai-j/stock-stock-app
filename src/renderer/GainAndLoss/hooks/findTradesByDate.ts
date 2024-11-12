import { getDayCustom } from './getDayCustom'
import { isInSameLongPeriod } from './isInSamePeriod'

/**
 * 損益データ配列の中に指定日を含むデータをさがす
 * @param galGroupedByLongPeriod 損益データ
 * @param selectedDate 表示日
 * @param interval 損益をまとめる間隔
 * @returns 指定日を含むデータ、なければnull
 */
export const findTradesByDate = (
  galGroupedByLongPeriod: TradeRecordGAL[][][],
  selectedDate: Date,
  interval: GALInterval
) => {
  for (let i = 0; i < galGroupedByLongPeriod.length; i++) {
    const galGroupedByPeriod = galGroupedByLongPeriod[i]
    const currDate = new Date(galGroupedByPeriod[0][0].date)
    if (interval == '1w')
      currDate.setDate(currDate.getDate() - getDayCustom(currDate))
    if (isInSameLongPeriod(interval, selectedDate, currDate))
      return galGroupedByPeriod
  }
  return null
}
