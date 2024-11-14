import { toLongShortPie } from './datas/longShortPie'
import { toBusinessTypePie } from './datas/businessTypePie'
import { Piee } from './Pie'
import { Scatter } from './Scatter'
import { toTimeAndGalScatterData } from './datas/timeAndGAL'
import './index.css'

export const OtherCharts = ({
  tradeGals,
}: {
  tradeGals: TradeRecordGAL[][]
}) => {
  console.log(tradeGals)
  const longTrades = tradeGals
    .flatMap((t) => t)
    .filter(
      (trade) => trade.tradeType == '現物売' || trade.tradeType == '信用返済売'
    )
  const shortTrades = tradeGals
    .flatMap((t) => t)
    .filter((trade) => trade.tradeType == '信用返済買')
  return (
    <div className="other-container other-size-height">
      <Piee data={toBusinessTypePie(tradeGals)} />
      <Piee data={toLongShortPie(tradeGals)} suffix="円" />
      <Scatter
        data={toTimeAndGalScatterData(longTrades)}
        title="時間と損益の関係 ロング"
        color={['#f55']}
      />
      {shortTrades.length ? (
        <Scatter
          data={toTimeAndGalScatterData(shortTrades)}
          title="時間と損益の関係 ショート"
          color={['#55f']}
        />
      ) : (
        <></>
      )}
    </div>
  )
}
