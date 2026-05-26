import { useState } from 'react'
import SortingVisualizer from './components/SortingVisualizer'
import ControlPanel from './components/ControlPanel'
import AlgorithmInfo from './components/AlgorithmInfo'
import { useRadixSort } from './hooks/useRadixSort'
import { ArrayElement, SortState, RadixBase } from './types'

function App() {
  const [base, setBase] = useState<RadixBase>(10)
  const [array, setArray] = useState<ArrayElement[]>([
    { id: 1, value: 170 },
    { id: 2, value: 45 },
    { id: 3, value: 75 },
    { id: 4, value: 90 },
    { id: 5, value: 802 },
    { id: 6, value: 24 },
    { id: 7, value: 2 },
    { id: 8, value: 66 },
  ])

  const {
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
    setSpeed,
  } = useRadixSort(array, base)

  const handleGenerateRandom = () => {
    const newArray: ArrayElement[] = []
    const maxVal = base === 2 ? 31 : 99999  // 二进制：5位，十进制：5位数
    for (let i = 0; i < 8; i++) {
      newArray.push({
        id: i + 1,
        value: Math.floor(Math.random() * (maxVal + 1)),
      })
    }
    setArray(newArray)
  }

  const handleArrayChange = (newArray: ArrayElement[]) => {
    setArray(newArray)
  }

  const handleBaseChange = (newBase: RadixBase) => {
    setBase(newBase)
    // 重置数组和排序状态
    const maxVal = newBase === 2 ? 31 : 99999
    const newArray: ArrayElement[] = []
    for (let i = 0; i < 8; i++) {
      newArray.push({
        id: i + 1,
        value: Math.floor(Math.random() * (maxVal + 1)),
      })
    }
    setArray(newArray)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">
          基数排序可视化
        </h1>

        {/* 进制选择 */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => handleBaseChange(10)}
            className={`px-6 py-2 rounded-lg font-bold transition-colors ${
              base === 10
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-indigo-600 border-2 border-indigo-600'
            }`}
          >
            十进制 (Radix 10)
          </button>
          <button
            onClick={() => handleBaseChange(2)}
            className={`px-6 py-2 rounded-lg font-bold transition-colors ${
              base === 2
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-indigo-600 border-2 border-indigo-600'
            }`}
          >
            二进制 (Radix 2)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SortingVisualizer
              array={sortedArray}
              state={state}
              buckets={buckets}
              currentDigit={currentDigit}
              maxDigits={maxDigits}
              stepDescription={stepDescription}
              base={base}
            />
          </div>

          <div className="space-y-6">
            <ControlPanel
              state={state}
              onStart={start}
              onPause={pause}
              onReset={reset}
              onStepForward={stepForward}
              onSpeedChange={setSpeed}
              onGenerateRandom={handleGenerateRandom}
              onArrayChange={handleArrayChange}
              array={array}
              base={base}
            />

            <AlgorithmInfo
              currentDigit={currentDigit}
              maxDigits={maxDigits}
              state={state}
              base={base}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
