import { getGAL } from 'renderer/GainAndLoss/hooks/getGAL'
import { priceFormatter } from 'renderer/hooks/priceFormatter'
import { formatToDateTime } from 'renderer/TradesHistory/hooks/formatToTime'

/** 損益リスト */
export const GALList = ({ tradeGals }: { tradeGals: TradeRecordGAL[][] }) => {
  /** 損益データを成形して返す */
  const getGals = () => {
    return tradeGals.map((trades) => {
      const galDetails: GALDetails = {
        gal: 0,
        period1: new Date(trades[0].date),
        period2: new Date(),
        quantity: 0,
        tradeNum: 0,
        gain: 0,
        loss: 0,
        fee: 0,
        tax: 0,
      }
      for (const trade of trades) {
        const tradeGal = getGAL(trade)
        galDetails.period2 = new Date(trade.date)
        galDetails.quantity += trade.quantity
        galDetails.tradeNum += 1
        galDetails.gain += tradeGal > 0 ? tradeGal * trade.quantity : 0
        galDetails.loss += tradeGal < 0 ? tradeGal * trade.quantity : 0
        galDetails.fee += trade.fee
        galDetails.tax += trade.tax
      }
      galDetails.gal +=
        galDetails.gain + galDetails.loss - (galDetails.fee + galDetails.tax)
      return galDetails
    })
  }
  return (
    <>
      <table>
        <thead>
          <tr>
            <th scope="col">期間</th>
            <th scope="col">取引株数</th>
            <th scope="col">取引回数</th>
            <th scope="col">損益合計</th>
            <th scope="col">利益</th>
            <th scope="col">損失</th>
            <th scope="col">手数料</th>
            <th scope="col">税金</th>
          </tr>
        </thead>
        <tbody>
          {getGals().map((tradeGal, index) => (
            <tr key={index} className={index % 2 ? 'dark' : 'light'}>
              <td scope="row" align="center">
                <div>{formatToDateTime(tradeGal.period1)}</div>
                <div>~{formatToDateTime(tradeGal.period2)}</div>
              </td>
              <td align="right">{tradeGal.quantity}株</td>
              <td align="right">{tradeGal.tradeNum}回</td>
              <td align="right">{priceFormatter(tradeGal.gal)}円</td>
              <td align="right">{priceFormatter(tradeGal.gain)}円</td>
              <td align="right">{priceFormatter(tradeGal.loss)}円</td>
              <td align="right">{priceFormatter(tradeGal.fee)}円</td>
              <td align="right">{priceFormatter(tradeGal.tax)}円</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
