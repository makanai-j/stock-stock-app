/**
 * 曜日の始まりを変更してかえす
 * @param date 曜日を取得したい日付
 * @returns
 */
export const getDayCustom = (date: Date) => {
  const startDay = 1
  return (date.getDay() + (7 - startDay)) % 7
}
