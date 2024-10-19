const intervalArray = [
  '1m',
  '2m',
  '5m',
  '15m',
  '30m',
  '60m',
  '90m',
  '1h',
  '1d',
  '5d',
  '1wk',
  '1mo',
  '3m0',
] as const
type interval = (typeof intervalArray)[number]

export interface YFOptions {
  period2?: string | number | Date | undefined
  interval?: interval
  period1: string | number | Date
}

export const isIntervalString = (value: any): value is interval => {
  return intervalArray.includes(value)
}
