const intervalArray = [
  '1m',
  '2m',
  '5m',
  '15m',
  '30m',
  '60m',
  '90m',
  '1h',
  '1d',
  '5d',
  '1wk',
  '1mo',
  '3m0',
] as const
type interval = (typeof intervalArray)[number]

/**
 * チャート設定
 *
 * @interval 足の間隔
 * @period1 開始日時
 * @period2 終了日時
 */
export type YFOptions = {
  period2?: string | number | Date | undefined
  interval?: interval
  period1: string | number | Date
}

/**
 * yahoo-financeからの株式データ
 */
export type YFChartObject = {
  date: Date
  high: number
  volume: number
  open: number
  low: number
  close: number
  adjclose?: number
}

export const isIntervalString = (value: any): value is interval => {
  return intervalArray.includes(value)
}
