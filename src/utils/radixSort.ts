import { ArrayElement, Bucket, SortStep, RadixBase } from '../types'

// 获取数字的第 d 位（从最低位开始，d=0 表示个位/最低位）
export function getDigit(num: number, d: number, base: RadixBase = 10): number {
  return Math.floor(Math.abs(num) / Math.pow(base, d)) % base
}

// 获取数字的最大位数（根据进制）
export function getMaxDigits(arr: ArrayElement[], base: RadixBase = 10): number {
  if (arr.length === 0) return 0
  const max = Math.max(...arr.map(el => Math.abs(el.value)))
  if (max === 0) return 1

  if (base === 2) {
    // 二进制：计算需要的最少位数
    return Math.floor(Math.log2(max)) + 1
  } else {
    // 十进制
    return Math.floor(Math.log10(max)) + 1
  }
}

// 获取位数中文描述
function getDigitName(digit: number, base: RadixBase): string {
  if (base === 2) {
    return `第 ${digit + 1} 位（2^${digit}）`
  } else {
    if (digit === 0) return '个'
    if (digit === 1) return '十'
    if (digit === 2) return '百'
    if (digit === 3) return '千'
    if (digit === 4) return '万'
    return `${digit + 1}`
  }
}

// 基数排序的完整步骤生成器
export function* radixSortGenerator(arr: ArrayElement[], base: RadixBase = 10): Generator<SortStep> {
  if (arr.length === 0) return

  // 创建数组副本
  let array: ArrayElement[] = arr.map(el => ({ ...el }))
  const maxDigits = getMaxDigits(array, base)
  const bucketCount = base === 2 ? 2 : 10  // 二进制只有 0 和 1 两个桶

  yield {
    description: `开始基数排序（${base === 2 ? '二进制' : '十进制'}），最大位数: ${maxDigits}`,
    array: [...array],
    buckets: Array.from({ length: bucketCount }, (_, i) => ({ digit: i, elements: [] })),
    currentDigit: -1,
    maxDigits,
  }

  // 从最低位到最高位进行排序
  for (let digit = 0; digit < maxDigits; digit++) {
    // 初始化桶
    const buckets: Bucket[] = Array.from({ length: bucketCount }, (_, i) => ({
      digit: i,
      elements: [],
    }))

    yield {
      description: `第 ${digit + 1} 轮: 按照${getDigitName(digit, base)}位排序`,
      array: [...array],
      buckets: buckets.map(b => ({ ...b, elements: [...b.elements] })),
      currentDigit: digit,
      maxDigits,
    }

    // 将元素分配到桶中
    for (let i = 0; i < array.length; i++) {
      const element = array[i]
      const digitValue = getDigit(element.value, digit, base)
      buckets[digitValue].elements.push({ ...element })

      yield {
        description: `将 ${element.value} 放入桶 ${digitValue}（${getDigitName(digit, base)}位是 ${digitValue}）`,
        array: [...array],
        buckets: buckets.map(b => ({ ...b, elements: b.elements.map(el => ({ ...el })) })),
        currentDigit: digit,
        maxDigits,
      }
    }

    // 从桶中收集元素
    array = []
    for (let i = 0; i < bucketCount; i++) {
      for (let j = 0; j < buckets[i].elements.length; j++) {
        array.push({ ...buckets[i].elements[j] })
      }
    }

    yield {
      description: `第 ${digit + 1} 轮排序完成，从桶中收集元素: [${array.map(el => el.value).join(', ')}]`,
      array: [...array],
      buckets: buckets.map(b => ({ ...b, elements: b.elements.map(el => ({ ...el })) })),
      currentDigit: digit,
      maxDigits,
    }
  }

  yield {
    description: '排序完成！',
    array: [...array],
    buckets: Array.from({ length: bucketCount }, (_, i) => ({ digit: i, elements: [] })),
    currentDigit: maxDigits - 1,
    maxDigits,
  }
}
