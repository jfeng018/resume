"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Icon } from "@iconify/react"
import ColorPicker from "@/components/color-picker"
import type { TextStyle } from "@/types/resume"

// 支持的字体列表
const FONT_FAMILIES = [
  { value: 'Microsoft YaHei', label: '微软雅黑' },
  { value: 'SimSun', label: '宋体' },
  { value: 'SimHei', label: '黑体' },
  { value: 'KaiTi', label: '楷体' },
  { value: 'FangSong', label: '仿宋' },
  { value: 'PingFang SC', label: '苹方' },
  { value: 'Heiti SC', label: '黑体-简' },
  { value: 'STSong', label: '华文宋体' },
  { value: 'STKaiti', label: '华文楷体' },
  { value: 'STFangsong', label: '华文仿宋' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Calibri', label: 'Calibri' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Consolas', label: 'Consolas' },
  { value: 'Monaco', label: 'Monaco' },
]

// 支持的字号列表
const FONT_SIZES = [9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36]

// 预设颜色
const PRESET_COLORS = [
  '#000000', '#666666', '#999999',
  '#d73a49', '#e36209', '#f9c513', '#28a745',
  '#0366d6', '#6f42c1', '#ea4aaa', '#ffffff',
]

interface RichTextToolbarProps {
  currentStyle: Partial<TextStyle>
  onApplyStyle: (key: keyof TextStyle, value: any) => void
  onAlignChange?: (align: 'left' | 'center' | 'right' | 'justify') => void
  onListChange?: (type: 'bullet-list' | 'numbered-list' | null) => void
  currentAlign?: 'left' | 'center' | 'right' | 'justify'
  currentListType?: 'bullet-list' | 'numbered-list' | null
}

export default function RichTextToolbar({
  currentStyle,
  onApplyStyle,
  onAlignChange,
  onListChange,
  currentAlign = 'left',
  currentListType = null,
}: RichTextToolbarProps) {
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const toolbarRef = useState<HTMLDivElement | null>(null)[0]

  return (
    <div className="relative bg-white text-slate-800 rounded shadow-lg p-1.5 space-y-1 min-w-[300px] text-xs border border-slate-200">
      {/* 第一行：字体和字号 */}
      <div className="flex items-center gap-1">
        <Select
          value={currentStyle.fontFamily || 'Microsoft YaHei'}
          onValueChange={(value) => onApplyStyle('fontFamily', value)}
        >
          <SelectTrigger className="flex-1 h-6 text-xs bg-slate-100 border-slate-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(currentStyle.fontSize || 12)}
          onValueChange={(value) => onApplyStyle('fontSize', Number(value))}
        >
          <SelectTrigger className="flex-1 h-6 text-xs bg-blue-100 border-blue-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZES.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size < 10 ? `0${size}` : size}pt
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 第二行：格式按钮 */}
      <div className="flex items-center gap-0.5">
        {/* 加粗 */}
        <Button
          size="sm"
          variant={currentStyle.bold ? "default" : "ghost"}
          className={`h-6 w-6 p-0 text-xs ${currentStyle.bold ? "bg-slate-300" : "hover:bg-slate-100"}`}
          onClick={() => onApplyStyle('bold', !currentStyle.bold)}
          title="加粗 (Ctrl+B)"
        >
          <span className="font-bold">B</span>
        </Button>

        {/* 斜体 */}
        <Button
          size="sm"
          variant={currentStyle.italic ? "default" : "ghost"}
          className={`h-6 w-6 p-0 text-xs ${currentStyle.italic ? "bg-slate-300" : "hover:bg-slate-100"}`}
          onClick={() => onApplyStyle('italic', !currentStyle.italic)}
          title="斜体 (Ctrl+I)"
        >
          <span className="italic">I</span>
        </Button>

        {/* 行内代码 */}
        <Button
          size="sm"
          variant={currentStyle.code ? "default" : "ghost"}
          className={`h-6 w-6 p-0 ${currentStyle.code ? "bg-slate-300" : "hover:bg-slate-100"}`}
          onClick={() => onApplyStyle('code', !currentStyle.code)}
          title="行内代码 (Ctrl+`)"
        >
          <Icon icon="mdi:code-tags" className="w-3 h-3" />
        </Button>

        <div className="w-px h-4 bg-slate-300 mx-0.5" />

        {/* 对齐方式 */}
        {onAlignChange && (
          <>
            <Button
              size="sm"
              variant={currentAlign === 'left' ? "default" : "ghost"}
              className={`h-6 w-6 p-0 ${currentAlign === 'left' ? "bg-slate-300" : "hover:bg-slate-100"}`}
              onClick={() => onAlignChange('left')}
              title="左对齐"
            >
              <Icon icon="mdi:format-align-left" className="w-3 h-3" />
            </Button>

            <Button
              size="sm"
              variant={currentAlign === 'center' ? "default" : "ghost"}
              className={`h-6 w-6 p-0 ${currentAlign === 'center' ? "bg-slate-300" : "hover:bg-slate-100"}`}
              onClick={() => onAlignChange('center')}
              title="居中对齐"
            >
              <Icon icon="mdi:format-align-center" className="w-3 h-3" />
            </Button>

            <Button
              size="sm"
              variant={currentAlign === 'right' ? "default" : "ghost"}
              className={`h-6 w-6 p-0 ${currentAlign === 'right' ? "bg-blue-200" : "hover:bg-slate-100"}`}
              onClick={() => onAlignChange('right')}
              title="右对齐"
            >
              <Icon icon="mdi:format-align-right" className="w-3 h-3" />
            </Button>

            <Button
              size="sm"
              variant={currentAlign === 'justify' ? "default" : "ghost"}
              className={`h-6 w-6 p-0 ${currentAlign === 'justify' ? "bg-slate-300" : "hover:bg-slate-100"}`}
              onClick={() => onAlignChange('justify')}
              title="两端对齐"
            >
              <Icon icon="mdi:format-align-justify" className="w-3 h-3" />
            </Button>

            <div className="w-px h-4 bg-slate-300 mx-0.5" />
          </>
        )}

        {/* 列表 */}
        {onListChange && (
          <>
            <Button
              size="sm"
              variant={currentListType === 'bullet-list' ? "default" : "ghost"}
              className={`h-6 w-6 p-0 ${currentListType === 'bullet-list' ? "bg-blue-200" : "hover:bg-slate-100"}`}
              onClick={() => onListChange(currentListType === 'bullet-list' ? null : 'bullet-list')}
              title="无序列表"
            >
              <Icon icon="mdi:format-list-bulleted" className="w-3 h-3" />
            </Button>

            <Button
              size="sm"
              variant={currentListType === 'numbered-list' ? "default" : "ghost"}
              className={`h-6 w-6 p-0 ${currentListType === 'numbered-list' ? "bg-slate-300" : "hover:bg-slate-100"}`}
              onClick={() => onListChange(currentListType === 'numbered-list' ? null : 'numbered-list')}
              title="有序列表"
            >
              <Icon icon="mdi:format-list-numbered" className="w-3 h-3" />
            </Button>

            <div className="w-px h-4 bg-slate-300 mx-0.5" />
          </>
        )}

        {/* 文字颜色 */}
        <Popover
          open={colorPickerOpen}
          onOpenChange={() => {
            // 完全忽略自动关闭请求，只通过按钮手动控制
          }}
        >
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-slate-100 relative"
              title="文字颜色"
              onClick={() => setColorPickerOpen(!colorPickerOpen)}
            >
              <Icon icon="mdi:format-color-text" className="w-3 h-3" />
              <div
                className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5"
                style={{ backgroundColor: currentStyle.color || '#000000' }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-2 bg-white"
            align="end"
            side="bottom"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            onPointerDownOutside={(e) => e.preventDefault()}
            onFocusOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            {!showCustomPicker ? (
              // 预设颜色选择器
              <div className="grid grid-cols-4 gap-1">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-gray-300 hover:border-blue-500 transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onApplyStyle('color', color)
                      setColorPickerOpen(false)
                    }}
                    title={color}
                  />
                ))}
                {/* 自定义颜色按钮 */}
                <button
                  className="w-6 h-6 rounded border border-gray-300 hover:border-blue-500 transition-colors cursor-pointer flex items-center justify-center bg-white"
                  title="自定义颜色"
                  onClick={() => setShowCustomPicker(true)}
                >
                  <Icon icon="mdi:palette" className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            ) : null}
          </PopoverContent>
        </Popover>
      </div>

      {/* 独立的自定义颜色选择器 */}
      {showCustomPicker && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 bg-black/50 z-[9998]"
            onClick={() => setShowCustomPicker(false)}
          />
          {/* 颜色选择器 - 定位在工具栏右侧 */}
          <div className="absolute top-0 left-full ml-2 z-[9999]">
            <ColorPicker
              initialColor={currentStyle.color || '#000000'}
              onSave={(color) => {
                onApplyStyle('color', color)
                setShowCustomPicker(false)
                setColorPickerOpen(false)
              }}
              onCancel={() => {
                setShowCustomPicker(false)
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
