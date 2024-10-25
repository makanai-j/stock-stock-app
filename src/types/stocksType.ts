type profile = {
  code: number
  company: string
  market: string
  typeCode33: number
  typeName33: string
}

type tradeType =
  | '現物買'
  | '現物売'
  | '信用新規買'
  | '信用新規売'
  | '信用返済買'
  | '信用返済売'

type holdType = '一般' | '特定' | 'NISA'

type tradeDataObject = {
  id: string
  date: Date | string | number
  code: number
  tradeType: tradeType
  holdType: holdType
  quantity: number
  restQuantity?: number
  price: number
  fee: number
  tax: number
}

type tradeDataKey =
  | 'date'
  | 'code'
  | 'tradeType'
  | 'holdType'
  | 'quantity'
  | 'restQuantity'
  | 'price'
  | 'fee'
  | 'tax'
