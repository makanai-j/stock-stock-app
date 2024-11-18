import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'

import { CRUD } from './db/crud'
import { objectToCamelCase, objectToSnakeCase } from './db/dbHooks'
import { csvFileRead } from './hooks/csvFileRead'
import { yfGetChartData } from './hooks/getChartData'

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

const createWindow = (): void => {
  // Create the browser window.
  console.log(__dirname)
  console.log(path.join(__dirname, '/assets/icon.ico'))
  const mainWindow = new BrowserWindow({
    title: 'ss',
    height: 600,
    width: 800,
    minWidth: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })

  const setWinTitle = () => {
    if (mainWindow) {
      mainWindow.title = `stockstock`
      mainWindow.setIcon(path.join(__dirname, 'src/assets/icon.ico'))
    }
    return true
  }

  // and load the index.html of the app.
  mainWindow
    .loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
    .then(setWinTitle)
    .catch((e) => console.log(e))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // yahoo-financeから株式データの取得
  ipcMain.handle(
    'chart',
    async (_event, query: { symbol: string; options: YFOptions }) => {
      return await yfGetChartData(query.symbol, query.options)
    }
  )

  // CRUD
  ipcMain.handle(
    'insert',
    (_event, tradeRecords: TradeRecord[]): Promise<void> => {
      return CRUD.insert(
        tradeRecords.map((record) => objectToSnakeCase(record))
      )
    }
  )
  ipcMain.handle('select', async (_event, options: SelectFilterOptions) => {
    const trade_records = await CRUD.select(options)
    return trade_records.map((record) => objectToCamelCase(record))
  })
  ipcMain.handle('update', (_event, records: TradeRecord[]): Promise<void> => {
    return CRUD.update(records.map((record) => objectToSnakeCase(record)))
  })
  ipcMain.handle('delete', (_event, ids: string[]): Promise<void> => {
    return CRUD.delete(ids)
  })

  // csvファイルを読み込み
  ipcMain.handle('fileRead', () => {
    return csvFileRead()
  })

  createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
