import { YFChartObject } from '../../../../../types/yfTypes'

type EChartsOptionData = {
  xAxisData: string[]
  xAxisData0: string[]
  yAxisData: number[][]
  markLineData: string[]
}

/**
 *
 * @param yfChartData yahoo-financeAPIからの株式価格オブジェクト
 * @param interval 足の間隔
 * @returns eCharts用の軸データとマークラインデータ
 */
export const toEChartsData = (
  yfChartData: YFChartObject[],
  interval = '5m'
): EChartsOptionData => {
  const eChartsData: EChartsOptionData = {
    xAxisData: [],
    xAxisData0: [],
    yAxisData: [],
    markLineData: [],
  }

  for (let i = 0; i < yfChartData.length; i++) {
    const obj = yfChartData[i]
    const x = obj.date.toLocaleTimeString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
    })

    if (!obj.open) {
      continue
    }

    const y = []
    y.push(obj.open)
    y.push(obj.close)
    y.push(obj.low)
    y.push(obj.high)

    eChartsData.xAxisData.push(x)
    eChartsData.yAxisData.push(y)

    // 前のデータの日時要素
    const preDate: Date = yfChartData[i == 0 ? 0 : i - 1].date

    //  足の間隔によってDateのフォーマットを変える
    switch (interval) {
      case '1d':
      case '5d':
      case '1wk':
        if (i == 0 || obj.date.getMonth() != preDate.getMonth()) {
          console.log('month')
          eChartsData.xAxisData0.push(obj.date.getMonth().toString())
        } else {
          eChartsData.xAxisData0.push('')
        }
        break
      case '1mo':
      case '3m0':
        if (i == 0 || obj.date.getFullYear() != preDate.getFullYear()) {
          eChartsData.xAxisData0.push(obj.date.getFullYear().toString())
        } else {
          eChartsData.xAxisData0.push('')
        }
        break
      // 1m ～ 1h
      default:
        if (i == 0 || obj.date.getDate() !== preDate.getDate()) {
          eChartsData.xAxisData0.push(
            obj.date.getMonth() + '/' + obj.date.getDate()
          )
        } else {
          eChartsData.xAxisData0.push('')
        }
    }
  }
  return eChartsData
}
