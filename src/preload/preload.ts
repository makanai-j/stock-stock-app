import { contextBridge, ipcRenderer } from 'electron'
import { YFOptions } from '../types/yfTypes'

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
   * @returns
   */
  fileRead: async () => await ipcRenderer.invoke('fileRead'),
})
