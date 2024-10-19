import { contextBridge, ipcRenderer } from 'electron'
import { YFOptions } from '../../finance/yfOption'

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateCounter: (callback: (value: number) => void) =>
    ipcRenderer.on('update-counter', (_event, value: number) =>
      callback(value)
    ),
  counterValue: (value: number) => ipcRenderer.send('counter-value', value),
  financeData: async (symbol: string, options: YFOptions) =>
    await ipcRenderer.invoke('chart', { symbol, options }),
})
