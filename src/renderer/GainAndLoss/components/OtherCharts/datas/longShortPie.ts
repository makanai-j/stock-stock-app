export const toLongShortPie = (tradeGals: TradeRecordGAL[][]) => {
  const data: {
    name: string
    value: number
    color: string
  }[] = [
    {
      name: 'Long plus',
      value: 0,
      color: '#d33',
    },
    {
      name: 'Long minus',
      value: 0,
      color: '#e55',
    },
    {
      name: 'Short plus',
      value: 0,
      color: '#33d',
    },
    {
      name: 'Short minus',
      value: 0,
      color: '#55e',
    },
  ]

  for (const trades of tradeGals) {
    const longTrades = trades.filter(
      (trade) => trade.tradeType == '現物売' || trade.tradeType == '信用返済売'
    )
    const shortTrades = trades.filter(
      (trade) => trade.tradeType == '信用返済買'
    )

    data[0].value += longTrades
      .filter((trade) => trade.gal > 0)
      .reduce((sum, curr) => sum + curr.gal, 0)
    data[1].value += longTrades
      .filter((trade) => trade.gal < 0)
      .reduce((sum, curr) => sum + Math.abs(curr.gal), 0)
    data[2].value += shortTrades
      .filter((trade) => trade.gal > 0)
      .reduce((sum, curr) => sum + curr.gal, 0)
    data[3].value += shortTrades
      .filter((trade) => trade.gal < 0)
      .reduce((sum, curr) => sum + Math.abs(curr.gal), 0)
  }

  return data
}
