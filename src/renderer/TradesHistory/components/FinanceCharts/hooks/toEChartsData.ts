//import { YFChartObject } from '../../../../../types/yfTypes'

type EChartsOptionData = {
  xAxisData: string[]
  xAxisData0: string[]
  yAxisData: number[][]
  markLineData: string[]
}

/**
 *
 * @param yfChartDatas yahoo-financeAPIからの株式価格オブジェクト
 * @param interval 足の間隔
 * @returns eCharts用の軸データとマークラインデータ
 */
export const toEChartsData = (
  yfChartDatas: YFChartObject[],
  interval = '5m'
): EChartsOptionData => {
  const eChartsData: EChartsOptionData = {
    xAxisData: [],
    xAxisData0: [],
    yAxisData: [],
    markLineData: [],
  }

  for (let i = 0; i < yfChartDatas.length; i++) {
    const chartData = yfChartDatas[i]
    const x = chartData.date.toLocaleTimeString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
    })

    if (!chartData.open) {
      continue
    }

    const y = []
    y.push(chartData.open)
    y.push(chartData.close)
    y.push(chartData.low)
    y.push(chartData.high)

    eChartsData.xAxisData.push(x)
    eChartsData.yAxisData.push(y)

    // 前のデータの日時要素
    const preDate: Date = yfChartDatas[i == 0 ? 0 : i - 1].date
    const date: Date = chartData.date

    //  足の間隔によってDateのフォーマットを変える
    switch (interval) {
      case '1d':
      case '5d':
      case '1wk':
        if (i == 0 || date.getMonth() != preDate.getMonth()) {
          eChartsData.xAxisData0.push(`${date.getMonth() + 1}`)
        } else {
          eChartsData.xAxisData0.push('')
        }
        break
      case '1mo':
      case '3m0':
        if (i == 0 || date.getFullYear() != preDate.getFullYear()) {
          eChartsData.xAxisData0.push(date.getFullYear().toString())
        } else {
          eChartsData.xAxisData0.push('')
        }
        break
      // 1m ～ 1h
      default:
        if (i == 0 || date.getDate() !== preDate.getDate()) {
          eChartsData.xAxisData0.push(
            `${date.getMonth() + 1}/${date.getDate()}`
          )
        } else {
          eChartsData.xAxisData0.push('')
        }
    }
  }
  return eChartsData
}
