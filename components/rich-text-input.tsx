"use client"
import { useEffect, useRef, useState } from "react"
import type { ModuleContentElement, TextSegment, TextStyle } from "@/types/resume"
import RichTextToolbar from "./rich-text-toolbar"

interface RichTextInputProps {
  element: ModuleContentElement
  onChange: (updates: Partial<ModuleContentElement>) => void
  placeholder?: string
  showBorder?: boolean
}

export default function RichTextInput({ element, onChange, placeholder, showBorder = true }: RichTextInputProps) {
  const [showToolbar, setShowToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })
  const [currentStyle, setCurrentStyle] = useState<Partial<TextStyle>>({})
  const editorRef = useRef<HTMLDivElement>(null)
  const isComposingRef = useRef(false)
  const lastTextRef = useRef('')

  // 监听文字选中
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed || !editorRef.current) {
        setShowToolbar(false)
        return
      }

      // 检查选区是否在当前编辑器内
      const range = selection.getRangeAt(0)
      if (!editorRef.current.contains(range.commonAncestorContainer)) {
        setShowToolbar(false)
        return
      }

      // 计算工具栏位置
      const rect = range.getBoundingClientRect()
      const toolbarWidth = 300 // 工具栏最小宽度
      let left = rect.left + rect.width / 2 - toolbarWidth / 2

      // 防止超出左边界
      if (left < 10) {
        left = 10
      }

      // 防止超出右边界
      if (left + toolbarWidth > window.innerWidth - 10) {
        left = window.innerWidth - toolbarWidth - 10
      }

      setToolbarPosition({
        top: rect.top - 120,
        left: left,
      })

      // 获取选中文字的样式
      const selectedStyle = getStyleAtSelection()
      setCurrentStyle(selectedStyle)

      setShowToolbar(true)
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [element.segments])

  // 获取选中文字的当前样式
  const getStyleAtSelection = (): Partial<TextStyle> => {
    // 简化实现：返回第一个segment的样式
    if (element.segments.length > 0) {
      return element.segments[0].style
    }
    return {}
  }

  // 应用样式到选中文字
  const applyStyle = (key: keyof TextStyle, value: any) => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) return

    const range = selection.getRangeAt(0)
    const selectedText = range.toString()

    // 简化实现：将整个内容替换为新样式
    // 实际应该根据选区位置拆分segments
    const newSegments: TextSegment[] = [
      {
        id: `seg-${Date.now()}`,
        text: selectedText,
        style: {
          ...currentStyle,
          [key]: value,
        },
      },
    ]

    onChange({ segments: newSegments })
    setCurrentStyle({ ...currentStyle, [key]: value })
  }

  // 处理对齐方式变化
  const handleAlignChange = (align: 'left' | 'center' | 'right' | 'justify') => {
    onChange({ align })
  }

  // 处理列表类型变化
  const handleListChange = (type: 'bullet-list' | 'numbered-list' | null) => {
    onChange({ type: type || 'text' })
  }



  // 渲染segments为HTML
  const renderSegments = () => {
    return element.segments.map((segment) => {
      const style: React.CSSProperties = {
        fontFamily: segment.style.fontFamily,
        fontSize: segment.style.fontSize ? `${segment.style.fontSize}pt` : undefined,
        color: segment.style.color,
        fontWeight: segment.style.bold ? 'bold' : undefined,
        fontStyle: segment.style.italic ? 'italic' : undefined,
      }

      if (segment.style.code) {
        return (
          <code
            key={segment.id}
            style={{
              ...style,
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '0.9em',
              color: '#d73a49',
              backgroundColor: '#f6f8fa',
              padding: '2px 6px',
              borderRadius: '3px',
              border: '1px solid #e1e4e8',
            }}
          >
            {segment.text}
          </code>
        )
      }

      return (
        <span key={segment.id} style={style}>
          {segment.text}
        </span>
      )
    })
  }

  // 初始化内容
  useEffect(() => {
    if (editorRef.current && !lastTextRef.current) {
      const text = element.segments.map(s => s.text).join('')
      editorRef.current.textContent = text
      lastTextRef.current = text
    }
  }, [])

  // 处理输入法开始
  const handleCompositionStart = () => {
    isComposingRef.current = true
  }

  // 处理输入法结束
  const handleCompositionEnd = (e: React.CompositionEvent<HTMLDivElement>) => {
    isComposingRef.current = false
    // 输入法结束后，手动触发一次更新
    handleInput(e)
  }

  // 处理内容变化
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    // 如果正在使用输入法，不处理
    if (isComposingRef.current) {
      return
    }

    const text = e.currentTarget.textContent || ''
    lastTextRef.current = text

    const newSegments: TextSegment[] = [
      {
        id: element.segments[0]?.id || `seg-${Date.now()}`,
        text,
        style: element.segments[0]?.style || {},
      },
    ]

    onChange({ segments: newSegments })
  }

  const containerStyle: React.CSSProperties = {
    textAlign: element.align || 'left',
  }

  return (
    <>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        className={`min-h-[40px] px-3 py-2 bg-white focus:outline-none transition-colors ${showBorder ? 'border border-dashed border-teal-200 focus:border-teal-300' : ''
          }`}
        style={containerStyle}
        data-placeholder={placeholder}
      />

      {showToolbar && (
        <div
          className="fixed z-50"
          style={{
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
          }}
        >
          <RichTextToolbar
            currentStyle={currentStyle}
            onApplyStyle={applyStyle}
            onAlignChange={handleAlignChange}
            onListChange={handleListChange}
            currentAlign={element.align}
            currentListType={element.type === 'text' ? null : element.type}
          />
        </div>
      )}
    </>
  )
}
