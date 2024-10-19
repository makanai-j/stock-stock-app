import { YFChartObject } from '../../finance/finance'

interface EChartsOptionData {
  xAxisData: string[]
  xAxisData0: string[]
  yAxisData: number[][]
  markLineData: string[]
}

export const toEChartsData = (
  objects: YFChartObject[],
  interval = '5m'
): EChartsOptionData => {
  const eChartsData: EChartsOptionData = {
    xAxisData: [],
    xAxisData0: [],
    yAxisData: [],
    markLineData: [],
  }

  for (let i = 0; i < objects.length; i++) {
    const obj = objects[i]
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

    if (i == 0) {
      eChartsData.xAxisData0.push('')
      continue
    }

    // 前のデータの日時要素
    const preDate: Date = objects[i - 1].date

    switch (interval) {
      case '1d':
      case '5d':
      case '1wk':
        if (obj.date.getMonth() != preDate.getMonth()) {
          eChartsData.xAxisData0.push(obj.date.getMonth().toString())
        } else {
          eChartsData.xAxisData0.push('')
        }
        break
      case '1mo':
      case '3m0':
        if (obj.date.getFullYear() != preDate.getFullYear()) {
          eChartsData.xAxisData0.push(obj.date.getFullYear().toString())
        } else {
          eChartsData.xAxisData0.push('')
        }
        break
      // 1m ～ 1h
      default:
        if (obj.date.getDate() !== preDate.getDate()) {
          console.log(preDate, '////', obj.date)
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
