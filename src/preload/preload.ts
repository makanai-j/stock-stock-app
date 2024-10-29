import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  financeData: async (symbol: string, options: YFOptions) =>
    await ipcRenderer.invoke('chart', { symbol, options }),
  fileRead: async () => await ipcRenderer.invoke('fileRead'),
})

contextBridge.exposeInMainWorld('crudAPI', {
  insert: async (tradeDatas: TradeRecord[]) => {
    /**
     * メインプロセスからのエラーはelectronによってラップされ、
     * カスタムエラーを返すことができない。
     * なので、特定のオブジェクトをかえし、レンダラーで判断するしかない。
     */
    const result = await ipcRenderer.invoke('insert', tradeDatas)
    if (isRejectedPromise(result)) {
      throw result
    }
  },
  select: async (options: tradeFilterOptions) =>
    ipcRenderer.invoke('select', options),
  update: async (tradeData: TradeRecord) => {
    ipcRenderer.invoke('update', tradeData)
  },
  delete: async (ids: string[]) => ipcRenderer.invoke('delete', ids),
})

const isRejectedPromise = (response: any) => {
  if (response === undefined) return false
  else if (response.failId) return true
  else return false
}
