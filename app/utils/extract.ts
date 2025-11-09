type WeekInfo = {
  number: number
  range?: string
}

export function extractWeek(str: string): WeekInfo | null {
  const regex = /Semana\s+(\d+)\s*\(?([^\)]*)\)?/
  const match = str.match(regex)

  if (!match) return null

  const number = Number(match[1])
  const range = match[2] ? match[2].trim() : undefined

  return { number, range }
}
