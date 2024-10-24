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
  select: async (id?: number) => ipcRenderer.invoke('select', id),
  update: async (id: number, tradeData: tradeDataObject) =>
    ipcRenderer.invoke('update', id, tradeData),
  delete: async (id: number) => ipcRenderer.invoke('delete', id),
})
