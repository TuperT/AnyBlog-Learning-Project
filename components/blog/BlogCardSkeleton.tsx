import { Skeleton } from "../ui/skeleton";

export function BlogCardSkeleton() {
    return (
        <div className="overflow-hidden p-2 md:p-0 border border-border shadow-card-shadow rounded-xl w-full h-full grid grid-cols-1 md:grid-cols-[0.8fr_1fr]">
        {/* Image */}
        <div className="p-4 md:p-0">
            <Skeleton className="relative min-h-44 md:min-h-58 w-full rounded-md md:rounded-none" />
        </div>

        <div className="flex min-w-0 flex-col justify-between px-4 md:py-4">
            {/* BlogMenu placeholder */}
            <div className="flex flex-row items-center justify-end">
            <Skeleton className="h-8 w-8 rounded-md" />
            </div>

            {/* Title & description */}
            <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="hidden sm:block h-3 w-2/3" />
            </div>
            </div>

            {/* Author & meta */}
            <div className="flex flex-row flex-wrap items-center justify-between mt-4 md:mt-0">
            <div className="flex flex-row gap-2 items-center">
                <Skeleton className="h-10 w-10 rounded-full" />

                <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-2">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3 w-32" />
                </div>
            </div>

            <Skeleton className="h-4 w-20" />
            </div>
        </div>
        </div>
    );
}