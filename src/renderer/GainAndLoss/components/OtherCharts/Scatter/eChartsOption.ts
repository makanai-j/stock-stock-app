export const scatterOption = {
  xAxis: {
    axisLabel: {
      show: false,
    },
    scale: true,
  },
  yAxis: {
    axisLabel: {
      fontSize: '8px',
      color: 'white',
    },
    scale: true,
  },
  tooltip: {
    position: function (
      pos: number[],
      _params: any,
      _el: any,
      _elRect: any,
      size: { contentSize: number[]; viewSize: number[] }
    ) {
      console.log(pos)
      const obj: { [position: string]: number } = {}
      if (pos[1] < size.viewSize[1] / 2) obj.top = pos[1] - 10
      else obj.top = pos[1] - size.contentSize[1]
      if (pos[0] < size.viewSize[0] / 2) obj.left = pos[0] + 10
      else obj.left = pos[0] - (size.contentSize[0] + 10)
      obj.bottom = 5
      return obj
    },
    formatter: (params: any) => {
      if (!params) return

      let dataStr = `<div>${params.marker}${params.seriesName}</div>`

      params.data.forEach((value: number, index: number) => {
        let data = ''
        if (index == 0) {
          const ms = 1000
          const mMs = 60 * ms
          const hMs = mMs * 60
          const dMs = hMs * 24
          if (value >= dMs) {
            const d = Math.floor(value / dMs)
            data += `${d}日`
            value -= d * dMs
          }
          if (value >= hMs) {
            const h = Math.floor(value / hMs)
            data += `${h}時間`
            value -= h * hMs
          }
          if (value >= mMs) {
            const m = Math.floor(value / mMs)
            data += `${m}分`
          }
        } else {
          data = value + '円'
        }
        dataStr += `
              <div style='display: flex'>
                  <div style='margin-left: 3%'>
                  ${index == 0 ? '経過時間' : '損益'}
                  </div>
                  <div style='margin-left: auto; margin-right: 3%; font-weight: 400'>${data}</div>
              </div>
          `
      })
      return dataStr
    },
  },
  grid: {
    top: 10,
    bottom: 15,
    left: 50,
  },
  series: [
    {
      type: 'scatter',
      symbolSize: 6,
      // prettier-ignore
      data: <number[][]>[[1,3]],
    },
  ],
}
