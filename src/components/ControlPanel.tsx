import { SortState, ArrayElement, RadixBase } from '../types'

interface ControlPanelProps {
  state: SortState
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onStepForward: () => void
  onSpeedChange: (speed: number) => void
  onGenerateRandom: () => void
  onArrayChange: (array: ArrayElement[]) => void
  array: ArrayElement[]
  base: RadixBase
}

export default function ControlPanel({
  state,
  onStart,
  onPause,
  onReset,
  onStepForward,
  onSpeedChange,
  onGenerateRandom,
  onArrayChange,
  array,
  base,
}: ControlPanelProps) {
  const maxValue = base === 2 ? 31 : 99999

  const handleArrayInputChange = (index: number, value: string) => {
    const newArray = [...array]
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= maxValue) {
      newArray[index] = { ...newArray[index], value: numValue }
      onArrayChange(newArray)
    }
  }

  const handleAddElement = () => {
    const newArray = [...array]
    newArray.push({
      id: Math.max(...newArray.map(el => el.id)) + 1,
      value: Math.floor(Math.random() * (maxValue + 1)),
    })
    onArrayChange(newArray)
  }

  const handleRemoveElement = (index: number) => {
    if (array.length <= 1) return
    const newArray = [...array]
    newArray.splice(index, 1)
    onArrayChange(newArray)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-indigo-900 mb-6">控制面板</h2>

      {/* 控制按钮 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {state === 'idle' || state === 'paused' ? (
          <button
            onClick={onStart}
            disabled={state === 'completed'}
            className="col-span-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span>▶</span> 开始排序
          </button>
        ) : (
          <button
            onClick={onPause}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span>⏸</span> 暂停
          </button>
        )}

        <button
          onClick={onStepForward}
          disabled={state === 'completed' || state === 'sorting'}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <span>⏭</span> 单步
        </button>

        <button
          onClick={onReset}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <span>↺</span> 重置
        </button>
      </div>

      {/* 速度控制 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          排序速度 (ms)
        </label>
        <input
          type="range"
          min="100"
          max="2000"
          step="100"
          defaultValue="500"
          onChange={(e) => onSpeedChange(parseInt(e.target.value))}
          className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>快 (100ms)</span>
          <span>慢 (2000ms)</span>
        </div>
      </div>

      {/* 随机生成 */}
      <button
        onClick={onGenerateRandom}
        disabled={state === 'sorting'}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 mb-6"
      >
        随机生成数组
      </button>

      {/* 数组编辑 */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-indigo-800">数组元素</h3>
          <button
            onClick={handleAddElement}
            disabled={state === 'sorting'}
            className="text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-1 px-3 rounded"
          >
            + 添加
          </button>
        </div>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {array.map((element, index) => (
            <div key={element.id} className="flex items-center gap-2">
              <span className="text-sm text-gray-500 w-8">[{index}]</span>
              <input
                type="number"
                value={element.value}
                onChange={(e) => handleArrayInputChange(index, e.target.value)}
                disabled={state === 'sorting'}
                className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              />
              <button
                onClick={() => handleRemoveElement(index)}
                disabled={array.length <= 1 || state === 'sorting'}
                className="text-red-500 hover:text-red-700 disabled:text-gray-300"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
