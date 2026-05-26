import { SortState, RadixBase } from '../types'

interface AlgorithmInfoProps {
  currentDigit: number
  maxDigits: number
  state: SortState
  base: RadixBase
}

export default function AlgorithmInfo({
  currentDigit,
  maxDigits,
  state,
  base,
}: AlgorithmInfoProps) {
  const baseName = base === 2 ? '二进制 (Radix-2)' : '十进制 (Radix-10)'
  const bucketCount = base === 2 ? 2 : 10

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-indigo-900 mb-4">
        算法说明
        <span className="text-sm font-normal text-gray-500 ml-2">({baseName})</span>
      </h2>

      <div className="space-y-4 text-sm text-gray-700">
        <div>
          <h3 className="font-semibold text-indigo-700 mb-2">什么是基数排序？</h3>
          <p>
            基数排序（Radix Sort）是一种非比较型整数排序算法，其原理是将整数按位数切割成不同的数字，然后按每个位数分别比较。
            {base === 2 && '本模式使用二进制（基数为 2），在工程实践中非常实用。'}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-indigo-700 mb-2">算法步骤</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>找到数组中最大数字，确定最大位数</li>
            <li>从最低位开始，按当前位的值将数字分配到 0-{bucketCount - 1} 号桶中</li>
            <li>从桶中按顺序收集数字</li>
            <li>重复步骤 2-3，直到最高位排序完成</li>
          </ol>
        </div>

        <div>
          <h3 className="font-semibold text-indigo-700 mb-2">复杂度分析</h3>
          <ul className="space-y-1">
            <li><span className="font-medium">时间复杂度：</span>O(d × (n + b))</li>
            <li className="text-xs text-gray-500 ml-4">其中 d 是最大位数，n 是元素数量，b 是基数（{base === 2 ? '这里是 2' : '这里是 10'}）</li>
            <li><span className="font-medium">空间复杂度：</span>O(n + b)</li>
            <li className="text-xs text-gray-500 ml-4">需要额外的桶空间来存储元素</li>
            <li><span className="font-medium">稳定性：</span>稳定排序</li>
          </ul>
        </div>

        {state === 'sorting' || state === 'paused' ? (
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
            <h3 className="font-semibold text-indigo-700 mb-1">当前状态</h3>
            <p>
              正在对第 <span className="font-bold text-indigo-600">{currentDigit + 1}</span> 位进行排序
              （共 {maxDigits} 位）
            </p>
          </div>
        ) : null}

        {state === 'completed' ? (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-1">✓ 排序完成</h3>
            <p className="text-green-600">
              所有 {maxDigits} 轮排序已完成，数组已按升序排列。
            </p>
          </div>
        ) : null}

        <div>
          <h3 className="font-semibold text-indigo-700 mb-2">使用说明</h3>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>选择十进制或二进制模式</li>
            <li>点击"开始排序"开始可视化</li>
            <li>使用"单步"按钮逐步执行</li>
            <li>调节速度滑块控制排序速度</li>
            <li>可以编辑数组元素或随机生成</li>
            <li>观察数字如何分配到桶中并收集回来</li>
            {base === 2 && <li className="text-indigo-600">💡 二进制模式在工程实践中常用于位排序、掩码操作等场景</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
