import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

import { useSelectedTrades } from 'renderer/TradesHistory/SelectedTradesContext'
import { useYFOptions } from 'renderer/TradesHistory/YFOptionsContext'

import {
  initialEchartsOption,
  series,
  series0,
  separatorLine,
  xAxis,
  xAxis0,
  xAxis1,
} from './chart/eChartsOption'
import { toEChartsData } from './chart/toEChartsData'
//import { YFOptions } from '../../../../types/yfTypes'

/**
 * 株のチャート
 *
 * @param yfSymbol - 銘柄コード
 * @param yfOption - 足の間隔, 開始・終了日時
 */
export const FinanceChart = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const trades = useSelectedTrades()
  const yfOptions = useYFOptions()
  let myCharts: echarts.ECharts

  useEffect(() => {
    console.log('create chart', yfOptions)

    if (!trades?.length || !yfOptions || !chartRef) return

    console.log(yfOptions)
    window.electronAPI
      .financeData(`${trades[0].symbol}${trades[0].placeYF}`, yfOptions)
      .then((data) => {
        myCharts = echarts.init(chartRef.current)
        const eChartsData = toEChartsData(data, trades, yfOptions.interval)
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
                axisLabel: {
                  ...xAxis0.axisLabel,
                  interval: ![
                    '1d',
                    '5d',
                    '1wk',
                    '1mo',
                    '3mo',
                    undefined,
                  ].includes(yfOptions.interval)
                    ? 'auto'
                    : xAxis0.axisLabel.interval,
                },
                data: eChartsData.xAxisData0,
              },
              {
                ...xAxis1,
                data: eChartsData.xAxisData1,
              },
              {
                ...xAxis,
                data: eChartsData.xAxisData2,
              },
            ],
            series: [
              {
                ...series,
                data: eChartsData.yAxisData,
              },
              {
                ...series,
                xAxisIndex: 0,
                markArea: {
                  itemStyle: {
                    color: 'rgba(100,100,200,0.2)',
                  },
                  data: [
                    [...eChartsData.buyLineData, ...eChartsData.sellLineData],
                  ],
                },
                // markLine: {
                //   ...buyLine,
                //   data: eChartsData.buyLineData,
                // },
              },
              // {
              //   ...series,
              //   xAxisIndex: 0,
              //   markLine: {
              //     ...sellLine,
              //     data: eChartsData.sellLineData,
              //   },
              // },
              {
                ...series0,
                xAxisIndex: 3,
                markLine: {
                  ...separatorLine,
                  data: eChartsData.xAxisData2
                    .filter((value) => value != 0)
                    .map((value) => {
                      return { xAxis: value.toString() }
                    }),
                },
              },
            ],
          },
          true
        )
      })
      .catch((err) => {
        console.log(err)
      })
  }, [yfOptions])

  window.addEventListener('resize', () => {
    if (myCharts && chartRef) {
      myCharts.resize()
    }
  })

  return (
    <div
      ref={chartRef}
      style={{ width: 'calc(100vw - 300px)', height: 'calc(100vh - 210px)' }}
    ></div>
  )
}
