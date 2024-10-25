import { YFChartObject, YFOptions } from '../types/yfTypes'

export interface IElectronAPI {
  financeData: (symbol: string, interval: YFOptions) => Promise<YFChartObject[]>
  fileRead: () => Promise<any>
  insert: (tradeDatas: tradeDataObject[]) => Promise<any>
  select: (id?: string[]) => Promise<any>
  update: (id: string, tradeData: tradeDataObject) => Promise<void>
  delete: (ids: string[]) => Promise<void>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
