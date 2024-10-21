import yahooFinance from 'yahoo-finance2'
import { ChartOptions } from 'yahoo-finance2/dist/esm/src/modules/chart'
import { YFOptions, YFChartObject } from '../../types/yfTypes'

/**
 *yahoo-financeから株式データを取得
 *
 * @param symbol 銘柄名
 * @param queryOptions 足の間隔や開始・終了日時
 * @returns yahoo-finenceからの株式データ
 */
export const yfGetChartData = async (
  symbol: string,
  queryOptions: YFOptions
): Promise<YFChartObject[]> => {
  const qo = queryOptions as ChartOptions
  qo.return = 'array'
  const chart = await yahooFinance.chart(symbol, qo)
  //console.log(chart)
  return chart.quotes
}
