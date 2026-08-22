"use client"

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/atom-one-dark.css";

type markdownProps = {
    content: string
}

const Markdown = ({ content }: markdownProps) => {
    return (
        <article className="prose max-w-none dark:prose-invert prose-p:my-2 prose-p:leading-3 prose-headings:mt-4 prose-headings:mb-2 prose-h1:mt-0 prose-h1:mb-2 prose-h2:mt-4 prose-h2:mb-2 prose-h3:mt-4 prose-h3:mb-2">
            <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
                hr: () => (
                    <hr className="my-8 border-0 border-t border-border" />
                ),
                code: ({ children, ...props }) => {
                    const className = props.className || ""
                    const isInline = !className.includes("language-")
                    if (isInline) {
                        return <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>
                    }
                    return <code {...props}>{children}</code>
                },
            }}
            >
                {content}
            </ReactMarkdown>
        </article>
    )
}

export default Markdown