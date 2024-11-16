import { getGAL } from 'renderer/GainAndLoss/hooks/getGAL'

export const toTimeAndGalScatterData = (tradeGals: TradeRecordGAL[]) => {
  const getTime = (date: any) => new Date(date).getTime()
  return tradeGals.map((trade) => [
    getTime(trade.date) - getTime(trade.date0),
    getGAL(trade),
  ])
}
