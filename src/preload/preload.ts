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
     * ここでは
     * {failId: string}
     * というオブジェクトを返している
     */
    const result = await ipcRenderer.invoke('insert', tradeDatas)
    if (isRejectedPromise(result)) {
      throw result
    }
  },
  select: (options: SelectFilterOptions) => {
    return ipcRenderer.invoke('select', options)
  },
  update: (trades: TradeRecord) => {
    ipcRenderer.invoke('update', trades)
  },
  delete: (ids: string[]) => ipcRenderer.invoke('delete', ids),
})

const isRejectedPromise = (response: any) => {
  if (response === undefined) return false
  else if (response.failId) return true
  else return false
}
