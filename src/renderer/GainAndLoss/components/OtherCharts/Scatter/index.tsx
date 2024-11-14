import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'
import { scatterOption } from './eChartsOption'

export const Scatter = ({
  data,
  title,
  color = ['#5f5'],
}: {
  data: number[][]
  title: string
  color?: string[]
}) => {
  const chartRef = useRef<HTMLDivElement>(null)
  let myCharts: echarts.ECharts
  useEffect(() => {
    console.log(data)
    myCharts = echarts.init(chartRef.current)
    myCharts?.setOption({
      ...scatterOption,
      color,
      series: {
        ...scatterOption.series[0],
        name: title,
        data,
      },
    })
  }, [data])

  window.addEventListener('resize', () => {
    if (myCharts && chartRef) {
      myCharts.resize()
    }
  })

  return (
    <div
      ref={chartRef}
      className="other-size-height"
      style={{
        width: 'calc((30vh)*3)',
        maxWidth: '500px',
        minWidth: '260px',
      }}
    ></div>
  )
}

const formatter = (suffix: string) => {
  return (params: any) => {
    if (!params || !params.data) return
    return `
          <div style='display: flex; font-weight: 400; font-size: 12px; color: #000'>
              <div style='padding: 0; margin: 0;'>${params.marker}</div>
              <div style='padding: 0; margin: 0;'>
              ${params.name}
              </div>
              <div style=' margin-left: 10px; '>${params.value}${suffix}</div>
          </div>
      `
  }
}
