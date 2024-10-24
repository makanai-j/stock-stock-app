import { YFChartObject, YFOptions } from '../types/yfTypes'

export interface IElectronAPI {
  financeData: (symbol: string, interval: YFOptions) => Promise<YFChartObject[]>
  fileRead: () => Promise<any>
  insert: (tradeDatas: tradeDataObject[]) => Promise<any>
  select: (id?: number) => Promise<any>
  update: (id: number, tradeData: tradeDataObject) => Promise<void>
  delete: (id: number) => Promise<void>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
