import { toBusinessTypePie } from './datas/businessTypePie'
import { toLongShortPie } from './datas/longShortPie'
import { toTimeAndPnLScatterData } from './datas/timeAndPnL'
import { Piee } from './Pie'
import { Scatter } from './Scatter'

export const OtherCharts = ({
  tradePnLs,
}: {
  tradePnLs: TradeRecordPnL[][]
}) => {
  const longTrades = tradePnLs
    .flatMap((t) => t)
    .filter(
      (trade) => trade.tradeType == '現物売' || trade.tradeType == '信用返済売'
    )

  const shortTrades = tradePnLs
    .flatMap((t) => t)
    .filter((trade) => trade.tradeType == '信用返済買')
  return (
    <div className="other-container other-size-height">
      <Piee data={toBusinessTypePie(tradePnLs)} />
      <Piee data={toLongShortPie(tradePnLs)} suffix="円" />
      <Scatter
        data={toTimeAndPnLScatterData(longTrades)}
        title="時間と損益の関係 ロング"
        color={['#f55']}
      />
      {shortTrades.length ? (
        <Scatter
          data={toTimeAndPnLScatterData(shortTrades)}
          title="時間と損益の関係 ショート"
          color={['#55f']}
        />
      ) : (
        <></>
      )}
    </div>
  )
}
