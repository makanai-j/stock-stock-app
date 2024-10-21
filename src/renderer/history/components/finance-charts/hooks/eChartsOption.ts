const dateFormat: { [period: string]: 'numeric' | '2-digit' } = {
  //year: "numeric",
  //month: "2-digit",
  //day: "2-digit",
  hour: 'numeric',
  minute: '2-digit',
}

// static
const axisPointer = {
  link: [{ xAxisIndex: 'all' }],
  show: true,
}
const grid = [
  {
    left: 10,
    right: 10,
    top: 15,
    containLabel: true,
  },
]
const yAxis = {
  scale: true,
  splitArea: {
    show: true,
  },
  position: 'right',
  axisLabel: {
    fontSize: 10,
  },
  axisPointer: {
    label: {
      fontSize: 9,
    },
  },
}
const tooltip = {
  trigger: 'axis',
  xAxisIndex: 0,
  axisPointer: {
    type: 'cross',
  },
  position: function (
    pos: number[],
    _params: any,
    _el: any,
    _elRect: any,
    size: { contentSize: number[]; viewSize: number[] }
  ) {
    const obj: { [position: string]: number } = { top: 10 }
    if (pos[0] < size.viewSize[0] / 2) obj.right = 55
    else obj.left = 10
    return obj
  },
}

const dataZoom = [
  {
    type: 'inside',
    start: 98,
    end: 100,
    minValueSpan: 14,
  },
  {
    show: true,
    type: 'slider',
    bottom: 35,
    height: 25,
    start: 98,
    end: 100,
    minValueSpan: 14,
    labelFormatter: () => '',
  },
]

//
export const xAxis = {
  type: 'category',
  data: ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27'],
  boundaryGap: true,
  axisLine: { onZero: false },
  splitLine: { show: false },
  axisTick: {
    alignWithLabel: false,
  },
  axisLabel: {
    formatter: function (value: string) {
      if (!value) return ''
      const date: Date = new Date(value)
      return date.toLocaleTimeString('ja-JP', dateFormat)
    },
    align: 'left',
    fontSize: 10,
  },
  axisPointer: {
    label: {
      fontSize: 9,
    },
  },
}
export const xAxis0 = {
  ...xAxis,
  axisTick: {
    show: true,
    interval: (index: number, value: string) => value != '',
    alignWithLabel: false,
    inside: true,
    length: 380,
    lineStyle: {
      color: 'gray',
      type: 'solid', //[0.5, 2.5],
      opacity: 0.2,
    },
  },
  axisLabel: {
    /*
    formatter: function (value: string) {
      if (!value) return ''
      const date: Date = new Date(value)
      return date.toLocaleDateString('ja-JP', dateFormat)
    },*/
    align: 'center',
    fontSize: 9,
    interval: (index: number, value: string) => {
      return value != ''
    },
  },
  axisPointer: {
    show: false,
  },
}
export const series = {
  type: 'candlestick',
  barWidth: '85%',
  itemStyle: {
    color: '#FF0055',
    color0: '#12DDD6',
    borderColor: '#FF0055',
    borderColor0: '#12DDD6',
  },
  data: [] as number[][],
  markLine: {
    data: [],
    symbol: 'none',
    silent: true,
    lineStyle: {
      color: '#f40',
      type: [5, 10],
      opacity: 0.7,
    },
    emphasis: {
      disabled: true,
    },
    label: { show: false } /*
    label: {
      show: true,
      fontSize: 9,
      color: "#0f0",
      position: "insideEndTop"
    },*/,
    animation: false,
  },
}
export const series0 = {
  type: 'candlestick',
  xAxisIndex: 0,
  data: [],
  markLine: {
    data: [
      {
        xAxis: '2017-10-26',
        //coord: [0,1]
      },
      {
        yAxis: 30,
      },
    ],
    symbol: 'none',
    silent: true,
    lineStyle: {
      color: '#40f',
      type: [5, 10],
      opacity: 0.7,
    },
    emphasis: {
      disabled: true,
    },
    label: { show: false } /*
    label: {
      show: true,
      fontSize: 9,
      color: "#00f",
      position: "insideEndBottom"
    },*/,
    animation: false,
  },
}

/**
 * eChartsの初期設定
 */
export const initialEchartsOption = {
  axisPointer,
  grid,
  xAxis: [xAxis, xAxis0],
  yAxis,
  series: [series, series0],
  tooltip,
  dataZoom,
}
