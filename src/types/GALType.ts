type GAL = {
  gal: number
  period1: Date
  period2: Date
}

type TradeRecordGAL = {
  gal: number
} & TradeRecordBase

type GALInterval = '1d' | '1w' | '1mo' | '1y'

type EChartsDataGAL = {
  xAxisData: string[]
  xAxisData0: string[]
  xAxisData1: string[]
  yAxisData: number[]
  yAxisData0: number[]
}
