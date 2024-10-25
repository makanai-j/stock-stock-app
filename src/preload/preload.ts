import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * メインプロセスへ株式データを要求
   *
   * @param symbol - 銘柄コード
   * @param options - 足の間隔, 開始日時
   */
  financeData: async (symbol: string, options: YFOptions) =>
    await ipcRenderer.invoke('chart', { symbol, options }),
  /**
   * メインプロセスへcsvファイルの読み込みを要求
   *
   * @returns csvファイルのデータ
   */
  fileRead: async () => await ipcRenderer.invoke('fileRead'),
  insert: async (tradeDatas: tradeDataObject[]) =>
    await ipcRenderer.invoke('insert', tradeDatas),
  select: async (ids?: string[]) => ipcRenderer.invoke('select', ids),
  update: async (id: string, tradeData: tradeDataObject) =>
    ipcRenderer.invoke('update', id, tradeData),
  delete: async (ids: string[]) => ipcRenderer.invoke('delete', ids),
})
