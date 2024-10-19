import { YFChartObject, YFOptions } from '../../finance/finance'

export interface IElectronAPI {
  onUpdateCounter: (callback: (value: number) => void) => Electron.IpcRenderer
  counterValue: (value: number) => void
  financeData: (symbol: string, interval: YFOptions) => Promise<YFChartObject[]>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
