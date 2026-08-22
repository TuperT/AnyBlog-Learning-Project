import { Skeleton } from "../ui/skeleton"

const BlogImageSkeleton = () => {
    return (
        <div className="relative w-full overflow-hidden rounded-2xl aspect-video">
            <Skeleton className="w-1600 h-900" />
        </div>
    )
}

export default BlogImageSkeleton