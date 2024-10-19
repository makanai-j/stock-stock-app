import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 以下のように renderer プロセスで electron のモジュールを使用するとエラーが起こる
// import { ipcRenderer } from "electron";
// 解決するにはやっぱり preload を使うしかなさそう

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
let count = 0
window.electronAPI.onUpdateCounter((value: number) => {
  count += value
  console.log(count, 'from index.tsx')
  window.electronAPI.counterValue(count)
})

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
