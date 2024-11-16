type GALDetails = {
  period1: Date
  period2: Date
  gal: number
  quantity: number
  tradeNum: number
  gain: number
  loss: number
  fee: number
  tax: number
}

type TradeRecordGAL = {
  //gal: number
  date0: Date | string | number
  newTradePrice: number
  repayTradePrice: number
} & TradeRecordBase

type GALInterval = '1d' | '1w' | '1mo' | '1y'

type EChartsDataGAL = {
  xAxisData: string[]
  xAxisData0: string[]
  xAxisData1: string[]
  yAxisData: number[]
  yAxisData0: number[]
}
