import { ArrayElement, Bucket, SortState, RadixBase } from '../types'
import BucketDisplay from './BucketDisplay'

interface SortingVisualizerProps {
  array: ArrayElement[]
  state: SortState
  buckets: Bucket[]
  currentDigit: number
  maxDigits: number
  stepDescription: string
  base: RadixBase
}

export default function SortingVisualizer({
  array,
  state,
  buckets,
  currentDigit,
  maxDigits,
  stepDescription,
  base,
}: SortingVisualizerProps) {
  const maxValue = Math.max(...array.map(el => Math.abs(el.value)), 1)

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* 步骤说明 */}
      <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <p className="text-indigo-800 font-medium">{stepDescription}</p>
      </div>

      {/* 排序进度 */}
      {maxDigits > 0 && currentDigit >= 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-indigo-600 mb-2">
            <span>排序进度</span>
            <span>{currentDigit + 1} / {maxDigits} 轮</span>
          </div>
          <div className="w-full bg-indigo-100 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentDigit + 1) / maxDigits) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 数组可视化 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-indigo-800 mb-4">当前数组</h3>
        <div className="flex items-end justify-center gap-2 min-h-[300px] p-4 bg-gray-50 rounded-lg">
          {array.map((element, index) => {
            const heightPercent = (Math.abs(element.value) / maxValue) * 100
            const isNegative = element.value < 0

            return (
              <div
                key={element.id}
                className="flex flex-col items-center flex-1 max-w-[80px]"
              >
                <span className="text-sm font-mono font-bold text-indigo-700 mb-2">
                  {element.value}
                </span>
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    state === 'completed'
                      ? 'bg-green-500'
                      : isNegative
                      ? 'bg-red-400'
                      : 'bg-indigo-500'
                  }`}
                  style={{ height: `${Math.max(heightPercent, 5)}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-1">[{index}]</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 桶显示 */}
      <BucketDisplay buckets={buckets} currentDigit={currentDigit} base={base} />

      {/* 样式定义 */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  )
}
