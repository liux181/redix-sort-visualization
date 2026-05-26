import { useState, useRef, useCallback, useEffect } from 'react'
import { SortState, ArrayElement, Bucket, RadixBase } from '../types'
import { radixSortGenerator, getMaxDigits } from '../utils/radixSort'

export function useRadixSort(initialArray: ArrayElement[], base: RadixBase = 10) {
  const [state, setState] = useState<SortState>('idle')
  const [sortedArray, setSortedArray] = useState<ArrayElement[]>([...initialArray])
  const [buckets, setBuckets] = useState<Bucket[]>([])
  const [currentDigit, setCurrentDigit] = useState<number>(-1)
  const [maxDigits, setMaxDigits] = useState<number>(getMaxDigits(initialArray, base))
  const [stepDescription, setStepDescription] = useState<string>('点击"开始排序"按钮开始')
  const [speed, setSpeedValue] = useState<number>(500) // 毫秒

  const generatorRef = useRef<Generator | null>(null)
  const timerRef = useRef<number | null>(null)
  const isRunningRef = useRef<boolean>(false)

  // 根据 base 初始化 buckets
  useEffect(() => {
    const bucketCount = base === 2 ? 2 : 10
    setBuckets(Array.from({ length: bucketCount }, (_, i) => ({ digit: i, elements: [] })))
  }, [base])

  // 当数组或进制变化时，重置所有状态
  useEffect(() => {
    clearTimer()
    isRunningRef.current = false
    generatorRef.current = null
    setState('idle')
    setSortedArray([...initialArray])
    const bucketCount = base === 2 ? 2 : 10
    setBuckets(Array.from({ length: bucketCount }, (_, i) => ({ digit: i, elements: [] })))
    setCurrentDigit(-1)
    setMaxDigits(getMaxDigits(initialArray, base))
    setStepDescription('点击"开始排序"按钮开始')
  }, [initialArray, base])

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const runStep = useCallback(() => {
    if (!generatorRef.current || !isRunningRef.current) return

    const result = generatorRef.current.next()

    if (result.done) {
      setState('completed')
      setStepDescription('排序完成！')
      isRunningRef.current = false
      return
    }

    const step = result.value
    setStepDescription(step.description)
    setBuckets(step.buckets)
    setCurrentDigit(step.currentDigit)
    setMaxDigits(step.maxDigits)
    setSortedArray([...step.array])

    // 继续下一步
    timerRef.current = window.setTimeout(runStep, speed)
  }, [speed])

  const start = useCallback(() => {
    if (state === 'completed') return

    if (state === 'idle' || state === 'paused') {
      if (!generatorRef.current) {
        generatorRef.current = radixSortGenerator(initialArray, base)
      }
      isRunningRef.current = true
      setState('sorting')
      // 使用 setTimeout 确保在 state 更新后执行
      window.setTimeout(() => {
        runStep()
      }, 0)
    }
  }, [state, initialArray, base, runStep])

  const pause = useCallback(() => {
    if (state === 'sorting') {
      clearTimer()
      isRunningRef.current = false
      setState('paused')
      setStepDescription(prev => prev + ' (已暂停)')
    }
  }, [state, clearTimer])

  const reset = useCallback(() => {
    clearTimer()
    isRunningRef.current = false
    generatorRef.current = null
    setState('idle')
    setSortedArray([...initialArray])
    const bucketCount = base === 2 ? 2 : 10
    setBuckets(Array.from({ length: bucketCount }, (_, i) => ({ digit: i, elements: [] })))
    setCurrentDigit(-1)
    setMaxDigits(getMaxDigits(initialArray, base))
    setStepDescription('点击"开始排序"按钮开始')
  }, [clearTimer, initialArray, base])

  const stepForward = useCallback(() => {
    if (state === 'completed') return

    if (!generatorRef.current) {
      generatorRef.current = radixSortGenerator(initialArray, base)
    }

    // 如果正在运行，先暂停
    if (state === 'sorting') {
      clearTimer()
      isRunningRef.current = false
    }

    const result = generatorRef.current.next()

    if (result.done) {
      setState('completed')
      setStepDescription('排序完成！')
      isRunningRef.current = false
      return
    }

    const step = result.value
    setStepDescription(step.description)
    setBuckets(step.buckets)
    setCurrentDigit(step.currentDigit)
    setMaxDigits(step.maxDigits)
    setSortedArray([...step.array])
    setState('paused')
  }, [state, initialArray, base, clearTimer])

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeedValue(newSpeed)
  }, [])

  return {
    state,
    sortedArray,
    buckets,
    currentDigit,
    maxDigits,
    stepDescription,
    start,
    pause,
    reset,
    stepForward,
    setSpeed: updateSpeed,
  }
}
