
import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { toEChartsData } from './charts/eChartsModules'
import { initialEchartsOption, series, series0 } from './charts/eChartsOption'
import { YFOptions, isIntervalString } from '../finance/yfOption'

const App = () => {
  
  const [eOption, setEOption] = useState(initialEchartsOption)
  const [yfSymbol, setYFSymbol] = useState('5803.T')
  const initDate = new Date()
  initDate.setDate(initDate.getDate() - 15)
  const [yfOption, setYfOption] = useState({
    interval: "1h",
    period1: initDate
  } as YFOptions)

  const setIntervalYfOption = (value: string) => {
    if (isIntervalString(value)) {
      setYfOption({
        ...yfOption,
        interval: value,
      })
    }
  }

  const setPeriod = (date: Date | string) => {
    setYfOption({
      ...yfOption,
      period1: date,
    })
  }
  
  const createChart = () => {    
    if (!yfSymbol) return
    window.electronAPI
      .financeData(yfSymbol, yfOption)
      .then((data) => {
        const chartObj = toEChartsData(data)

        console.log(chartObj.xAxisData0)

        setEOption({
          ...initialEchartsOption,
          xAxis: [
            {
              ...initialEchartsOption.xAxis[0],
              data: chartObj.xAxisData,
            },
            {
              ...initialEchartsOption.xAxis[1],
              data: chartObj.xAxisData0,
            },
          ],
          series: [
            {
              ...series,
              data: chartObj.yAxisData,
            },
            {
              ...series0,
            },
          ],
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }
  
  const chartRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    console.log('create chart')
    const echart = echarts.init(chartRef.current)
    echart.setOption(eOption)
  })

  return (
    <div>
      <input
        type="text"
        onChange={(ev) => setYFSymbol(ev.target.value)}
      ></input>
      <input
        type="text"
        onChange={(ev) => setIntervalYfOption(ev.target.value)}
      ></input>
      <input type="date" onChange={(ev) => setPeriod(ev.target.value)}></input>
      <button onClick={createChart}>show chart</button>
      <div
        id="myChart"
        ref={chartRef}
        style={{ width: '500px', height: '500px' }}
      ></div>
    </div>
  )
    
}

export default App
