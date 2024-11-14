/**
 * @param data xとyのデータ
 * @returns 相関係数、傾き、切片
 *
 * @r 相関係数
 * @m 傾き
 * @b 切片
 */
export const correlation = (data: number[][]) => {
  const n = data.length

  const dataX = data.map((d) => d[0])
  const dataY = data.map((d) => d[1])

  const aveX = dataX.reduce((sum, curr) => sum + curr, 0) / n
  const aveY = dataY.reduce((sum, curr) => sum + curr, 0) / n

  const covariance =
    data.reduce((sum, curr) => (curr[0] - aveX) * (curr[1] - aveY) + sum, 0) / n

  // 分散
  const deviationX = Math.sqrt(
    dataX.reduce((sum, curr) => (curr - aveX) ** 2 + sum, 0) / n
  )
  const deviationY = Math.sqrt(
    dataY.reduce((sum, curr) => (curr - aveY) ** 2 + sum, 0) / n
  )

  // 最小二乗法: 傾き
  const m = covariance / (deviationX * deviationX)

  // 相関係数
  const r = covariance / (deviationX * deviationY)

  // 切片
  const a = covariance / deviationX ** 2
  const b = aveY - a * aveX

  return { r, sdX: deviationX, sdY: deviationY, m, b }
}
