import { Bucket, RadixBase } from '../types'

interface BucketDisplayProps {
  buckets: Bucket[]
  currentDigit: number
  base: RadixBase
}

export default function BucketDisplay({ buckets, currentDigit, base }: BucketDisplayProps) {
  const bucketCount = base === 2 ? 2 : 10
  const gridClass = base === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-5 lg:grid-cols-10'

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-indigo-800 mb-4">
        {currentDigit >= 0 ? `第 ${currentDigit + 1} 轮排序 - 桶状态` : '桶状态'}
        <span className="text-sm font-normal text-gray-500 ml-2">
          ({base === 2 ? '二进制模式' : '十进制模式'})
        </span>
      </h3>
      <div className={`grid ${gridClass} gap-2`}>
        {buckets.map((bucket) => (
          <div
            key={bucket.digit}
            className="bg-white rounded-lg border-2 border-indigo-200 p-2 min-h-[120px] flex flex-col"
          >
            <div className="text-center font-bold text-indigo-600 mb-2 border-b border-indigo-100 pb-1">
              {base === 2 ? `桶 ${bucket.digit} (${bucket.digit === 0 ? '0' : '1'})` : `桶 ${bucket.digit}`}
            </div>
            <div className="flex-1 flex flex-col gap-1">
              {bucket.elements.map((element, index) => (
                <div
                  key={`${element.id}-${index}`}
                  className="bg-indigo-100 text-indigo-800 rounded px-2 py-1 text-center font-mono font-bold text-sm animate-fade-in"
                  style={{
                    animation: 'fadeIn 0.3s ease-in-out',
                  }}
                >
                  {base === 2 ? element.value.toString(2) : element.value}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
