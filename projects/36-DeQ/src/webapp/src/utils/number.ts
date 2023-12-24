const formatter = new Intl.NumberFormat('en-US', {
})

export function formatNumber(num: string): string {
  return formatter.format(Number(num))
}
