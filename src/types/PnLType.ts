type PnLDetails = {
  period1: Date
  period2: Date
  periodPnL: number
  quantity: number
  tradeNum: number
  gain: number
  loss: number
  fee: number
  tax: number
}

type TradeRecordPnL = {
  date0: Date | string | number
  newTradePrice: number
  repayTradePrice: number
} & TradeRecordBase

type PnLInterval = '1d' | '1w' | '1mo' | '1y'

type EChartsDataPnL = {
  xAxisData: string[]
  xAxisData0: string[]
  xAxisData1: string[]
  yAxisData: number[]
  yAxisData0: number[]
}
