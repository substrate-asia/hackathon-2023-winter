import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function MarkdownView({ children }: { children: string }) {
  return (
    <main className={"prose prose-zinc max-w-full"}>
      <Markdown remarkPlugins={[remarkGfm]}>{children}</Markdown>
    </main>
  )
}
