import { YFChartObject, YFOptions } from '../types/yfTypes'

export interface IElectronAPI {
  financeData: (symbol: string, interval: YFOptions) => Promise<YFChartObject[]>
  fileRead: () => Promise<any>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
