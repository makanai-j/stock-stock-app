export const turnedTradeType = (type: tradeType): tradeType | null => {
  if (type == '現物買') return '現物売'
  else if (type == '現物売') return '現物買'
  else if (type == '信用返済買') return '信用新規売'
  else if (type == '信用返済売') return '信用新規買'
  return null
}

export const isNewTradeType = (
  type: tradeType
): type is '現物買' | '信用新規買' | '信用新規売' => {
  return ['現物買', '信用新規買', '信用新規売'].includes(type)
}
