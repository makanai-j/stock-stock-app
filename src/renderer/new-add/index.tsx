import HashStr from './hooks/Hash11'
import { AddRecordBar } from './components/AddRecordBar'
import { get } from 'lodash'


export const NewAdd = () => {

  return (
    <div>
      <AddRecordBar initializedTrade={iTrade()}></AddRecordBar>
    </div>
  )
}

class TradeManager {
  trades: TradeRecord[] = []

  getInitialTrade(): TradeRecord { 
    return {
    id: HashStr.randCode(),
    date: new Date(),
    symbol: '',
    tradeType: '現物買',
    quantity: 100,
    price: 0,
    fee: 0,
    tax: 0,
    holdType: '一般',
  }
}

  push() {
    this.trades.push(this.getInitialTrade())
  }

  
}