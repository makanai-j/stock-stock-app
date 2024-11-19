import { priceFormatter } from 'renderer/hooks/priceFormatter'
import { formatToDateTime } from 'renderer/TradesHistory/hooks/formatToTime'

export const TradesInfo = ({ trades }: { trades: TradeRecordRaw[] }) => {
  return (
    <div className="trades-info">
      <table>
        <thead>
          <tr>
            <th scope="col">時間</th>
            <th scope="col" colSpan={2}>
              銘柄
            </th>
            <th scope="col">取引</th>
            <th scope="col">株数</th>
            <th scope="col">約定単価</th>
            <th scope="col" colSpan={2}>
              市場
            </th>
            <th scope="col">手数料</th>
            <th scope="col">税金</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade.id}>
              <td scope="row">{formatToDateTime(trade.date)}</td>
              <td style={{ fontWeight: 600 }}>{trade.symbol}</td>
              <td>{trade.company}</td>
              <td>{trade.tradeType}</td>
              <td align="right">{priceFormatter(trade.quantity)}株</td>
              <td align="right">{priceFormatter(trade.price)}円</td>
              <td>{trade.place}</td>
              <td>{trade.market}</td>
              <td align="right">{priceFormatter(trade.fee)}円</td>
              <td align="right">{priceFormatter(trade.tax)}円</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
