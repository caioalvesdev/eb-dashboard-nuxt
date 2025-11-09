/* eslint-disable @typescript-eslint/no-explicit-any */
export function validateAndCleanData(data: Record<string, unknown>[]): Record<string, unknown>[] {
  const errors: string[] = []

  const excelErrors = [
    '#DIV/0!',
    '#VALUE!',
    '#REF!',
    '#NAME?',
    '#NUM!',
    '#N/A',
    '#NULL!',
    '#CALC!',
    '#SPILL!',
    '#CONNECT!',
    '#BLOCKED!',
    '#UNKNOWN!',
  ]

  data.forEach((item, index) => {
    Object.keys(item).forEach((key) => {
      const value = item[key]
      const rowNumber = index + 1

      if (typeof value === 'string' && excelErrors.includes(value.toUpperCase())) {
        errors.push(
          `Linha ${rowNumber}, Campo "${key}": Erro do Excel detectado "${value}" - corrija a fórmula na planilha`,
        )
      } else if (value === null || value === undefined) {
        errors.push(`Linha ${rowNumber}, Campo "${key}": Valor não pode ser null ou undefined`)
      } else if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
        errors.push(`Linha ${rowNumber}, Campo "${key}": Valor numérico inválido (${value})`)
      } else if (
        typeof value === 'string' &&
        (key.includes('valor') || key.includes('quantidade') || key.includes('meta')) &&
        value.trim() === ''
      ) {
        errors.push(`Linha ${rowNumber}, Campo "${key}": Campo numérico não pode estar vazio`)
      } else if (
        typeof value === 'string' &&
        (key.includes('valor') || key.includes('quantidade') || key.includes('meta'))
      ) {
        const numericValue = Number(value)
        if (isNaN(numericValue) || !isFinite(numericValue)) {
          errors.push(`Linha ${rowNumber}, Campo "${key}": Valor "${value}" não é um número válido`)
        }
      }
    })
  })

  if (errors.length > 0) {
    const errorMessage = `Dados inválidos encontrados:\n${errors.join('\n')}`
    throw new Error(errorMessage)
  }

  return data.map((item) => {
    const cleanedItem: Record<string, unknown> = {}

    Object.keys(item).forEach((key) => {
      let value = item[key]

      if (
        typeof value === 'string' &&
        (key.includes('valor') || key.includes('quantidade') || key.includes('meta'))
      ) {
        value = Number(value)
      }

      cleanedItem[key] = value
    })

    return cleanedItem
  })
}

export function isExcelError(value: unknown): boolean {
  if (typeof value !== 'string') return false

  const excelErrors = [
    '#DIV/0!',
    '#VALUE!',
    '#REF!',
    '#NAME?',
    '#NUM!',
    '#N/A',
    '#NULL!',
    '#CALC!',
    '#SPILL!',
    '#CONNECT!',
    '#BLOCKED!',
    '#UNKNOWN!',
  ]

  return excelErrors.includes(value.toUpperCase())
}

export function isValidNumericField(value: unknown, fieldName: string): boolean {
  const numericFields = ['valor', 'quantidade', 'meta', 'semana']
  const isNumericField = numericFields.some((field) => fieldName.includes(field))

  if (!isNumericField) return true

  if (value === null || value === undefined) return false
  if (typeof value === 'number') return !isNaN(value) && isFinite(value)
  if (typeof value === 'string') {
    if (value.trim() === '') return false
    const num = Number(value)
    return !isNaN(num) && isFinite(num)
  }

  return false
}

export function toToastMessage(error: any) {
  return h(
    'div',
    { class: 'bg-zinc-100 p-1 rounded-md flex flex-col gap-2' },
    error.message
      .replace('Dados inválidos encontrados:\n', '')
      .split('\n')
      .map((line: string, index: number) => h('span', { key: index }, [line])),
  )
}
