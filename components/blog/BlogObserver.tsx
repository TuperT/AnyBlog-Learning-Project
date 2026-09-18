"use client"

import { useEffect, useRef, useState } from "react"

type BlogObserverProps = {
    element: React.ReactNode
    postId: string
}

const BlogObserver = ({ element, postId }: BlogObserverProps) => {
    const ref = useRef<HTMLDivElement | null>(null)
    const [hasViewed, setHasViewed] = useState(false)

    useEffect(() => {
        const node = ref.current
        if (!node || hasViewed) return

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return

            setHasViewed(true)
            observer.disconnect()

            fetch("/api/blog/view", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postId }),
            }).catch((error) => {
                console.error("Failed to increment blog view:", error)
            })
        }, {
            threshold: 0.5,
        })

        observer.observe(node)

        return () => observer.disconnect()
    }, [postId, hasViewed])

    return <div ref={ref}>{element}</div>
}

export default BlogObserver