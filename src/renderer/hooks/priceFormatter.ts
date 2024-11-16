export const priceFormatter = (value: number) => {
  return (Math.floor(value * 100) / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
