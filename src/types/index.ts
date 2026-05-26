export interface ArrayElement {
  id: number
  value: number
}

export type SortState = 'idle' | 'sorting' | 'paused' | 'completed'

export type RadixBase = 10 | 2  // 十进制或二进制

export interface Bucket {
  digit: number
  elements: ArrayElement[]
}

export interface SortStep {
  description: string
  array: ArrayElement[]
  buckets: Bucket[]
  currentDigit: number
  maxDigits: number
}
