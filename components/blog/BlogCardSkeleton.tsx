import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function BlogCardSkeleton() {
    return (
        <Card className="overflow-hidden relative gap-3 pb-4 pt-0">
            {/* Image */}
            <div className="relative min-h-58 w-full overflow-hidden">
                <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
            </div>

            <CardHeader>
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-3/5 mt-2" />
            </CardHeader>

            <CardContent className="min-h-16">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-full mt-2" />
                <Skeleton className="h-3.5 w-2/3 mt-2" />
            </CardContent>

            <CardFooter className="flex items-center justify-between text-xs h-full">
                <span className="flex flex-row gap-2">
                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                    <span className="flex flex-col gap-2">
                        <Skeleton className="h-3.5 w-20" />
                        <Skeleton className="h-3 w-16" />
                    </span>
                </span>

                <Skeleton className="h-9 w-24 rounded-md" />
            </CardFooter>
        </Card>
    )
}