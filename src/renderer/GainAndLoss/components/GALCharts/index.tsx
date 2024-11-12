import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { useGAL } from 'renderer/GainAndLoss/GALContext'
import {
  initialEchartsOption,
  series,
  series0,
  xAxis,
  xAxis0,
  xAxis1,
} from './chart/eChartsOption'
import { toEChartsData } from './chart/toEChartsData'
import { useEChartsOption } from 'renderer/GainAndLoss/EChartsOptionContext'

/**
 * 損益のチャート
 */
export const GALChart = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const tradesGAL = useGAL()
  const eChartsOption = useEChartsOption()

  useEffect(() => {
    console.log('create chart')
    let eChartsData: EChartsDataGAL = {
      xAxisData: [],
      xAxisData0: [],
      xAxisData1: [],
      yAxisData: [0],
      yAxisData0: [],
    }

    const myCharts = echarts.init(chartRef.current)
    if (tradesGAL && eChartsOption)
      eChartsData = toEChartsData(
        tradesGAL,
        eChartsOption.date,
        eChartsOption.interval
      )

    myCharts?.setOption(
      {
        ...initialEchartsOption,
        xAxis: [
          {
            ...xAxis,
            data: eChartsData.xAxisData,
          },
          {
            ...xAxis0,
            data: eChartsData.xAxisData0,
          },
          {
            ...xAxis1,
            data: eChartsData.xAxisData1,
          },
        ],
        series: [
          {
            ...series,
            data: eChartsData.yAxisData,
          },
          {
            ...series0,
            data: eChartsData.yAxisData0,
          },
        ],
      },
      true
    )
  })

  return (
    <div>
      <div ref={chartRef} style={{ width: '500px', height: '350px' }}></div>
    </div>
  )
}
