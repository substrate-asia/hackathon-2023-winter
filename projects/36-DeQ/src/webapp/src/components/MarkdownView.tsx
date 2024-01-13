'use client';

import { useState, useMemo } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FaChevronDown } from "react-icons/fa"
import cn from '@/utils/cn'


export function MarkdownView({ children }: { children: string }) {
  const [opened, setOpened] = useState(false)
  const preview = useMemo(() => {
    const paragraphs = children?.trim()?.split('\n')?? []
    if (paragraphs.length > 2) {
      return paragraphs[0]
    }
    return null
  }, [children])
  return (
    <details
      open={opened || preview === null}
      onClick={(ev) => {
        ev.preventDefault()
        setOpened(!opened)
      }}
    >
      <summary
        className={cn("list-none", (opened || preview === null) ? 'hidden' : 'block')}
        onClick={(ev) => ev.preventDefault()}
      >
        {preview}
        <button
          onClick={() => setOpened(true)}
          className={cn(
            "inline-flex flex-row items-center gap-1.5 ml-2",
            "text-blue-400 hover:text-gray-700 transition-colors"
          )}
        >
          more
          <FaChevronDown className="h-2.5 relative top-0.5" />
        </button>
      </summary>
      <main className={"prose prose-zinc max-w-full"}>
        <Markdown remarkPlugins={[remarkGfm]}>{children}</Markdown>
      </main>
    </details>
  )
}
