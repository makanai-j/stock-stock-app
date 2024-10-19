import yahooFinance from 'yahoo-finance2'
import { ChartOptions } from 'yahoo-finance2/dist/esm/src/modules/chart'
import { YFOptions } from './yfOption'

export interface YFChartObject {
  date: Date
  high: number
  volume: number
  open: number
  low: number
  close: number
  adjclose?: number
}

export const yfGetChartData = async (
  symbol: string,
  queryOptions: YFOptions
): Promise<YFChartObject[]> => {
  const qo = queryOptions as ChartOptions
  qo.return = 'array'
  const chart = await yahooFinance.chart(symbol, qo)
  console.log('chart1', chart)
  return chart.quotes
}
