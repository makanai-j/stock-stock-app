type TradeType =
  | '現物買'
  | '現物売'
  | '信用新規買'
  | '信用新規売'
  | '信用返済買'
  | '信用返済売'

type HoldType = '一般' | '特定' | 'NISA'

type TradeRecord = {
  id: string
  date: Date | string | number
  symbol: string
  tradeType: TradeType
  holdType: HoldType
  quantity: number
  restQuantity?: number
  price: number
  fee: number
  tax: number
}

type TradeRecordDB = {
  id: string
  date: Date | string | number
  symbol: string
  trade_type: TradeType
  hold_type: HoldType
  quantity: number
  rest_quantity?: number
  price: number
  fee: number
  tax: number
}

type TradeRecordFull = {
  businessTypeCode: string
  businessTypeName: string
  company: string
  date: Date | string | number
  fee: number
  holdType: HoldType
  id: string
  market: string
  place: '東証' | '札証' | '福証' | '名証'
  placeYF: '.T' | '.S' | '.F' | '.N'
  price: number
  quantity: number
  restQuantity: number
  symbol: string
  tax: number
  tradeType: TradeType
}

type trade_data_key =
  | 'date'
  | 'symbol'
  | 'trade_type'
  | 'hold_type'
  | 'quantity'
  | 'rest_quantity'
  | 'price'
  | 'fee'
  | 'tax'

/**
 * @period1 開始日
 * @period2 終了日 指定されなければ、period1 ~ 今日 になる
 * @symbol 銘柄コード
 * @tradeType 取引区分
 * @holdType 預かり区分
 * @price 最低価格と最高価格
 * @place 取引所
 * @businessCode 業種コード
 */
type SlectFilterOptions = {
  id?: string
  limit?: number
  filter?: {
    period1?: Date | string | number
    period2?: Date | string | number
    symbol?: string
    tradeType?: TradeType
    holdType?: HoldType
    price?: { Lowest: number; Highest: number }
    place?: string
    businessCode?: string
  }
}
