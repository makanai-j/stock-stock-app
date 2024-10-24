import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { toEChartsData } from './hooks/toEChartsData'
import { initialEchartsOption, series, series0 } from './hooks/eChartsOption'
//import { YFOptions } from '../../../../types/yfTypes'

/**
 * 株のチャート
 *
 * @param yfSymbol - 銘柄コード
 * @param yfOption - 足の間隔, 開始・終了日時
 */
const FinanceChart = ({
  yfSymbol,
  yfOption,
}: {
  yfSymbol: string
  yfOption: YFOptions
}) => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('create chart')
    const myCharts = echarts.init(chartRef.current)

    window.electronAPI
      .financeData(yfSymbol, yfOption)
      .then((data) => {
        const chartObj = toEChartsData(data, yfOption.interval)

        myCharts?.setOption(
          {
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
          },
          true
        )
      })
      .catch((err) => {
        console.log(err)
      })
  })

  return (
    <div>
      <div ref={chartRef} style={{ width: '500px', height: '500px' }}></div>
    </div>
  )
}

export default FinanceChart
