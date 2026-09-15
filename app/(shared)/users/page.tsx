import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import UserCard from "@/components/ui/UserCard"
import { prisma } from "@/lib/db"
import { UserRound } from "lucide-react"

const page = async () => {
    const users = await prisma.user.findMany({
        select: {
            name: true,
            username: true,
            profilePicture: true,
            id: true,
            role: true,
            post: true,
            statistic: {
                select: {
                    readers: true
                }
            }
        }
    })

    return (
        <main className="mt-5 grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-4">
            {
            users.length > 0 ? (users.map((user, key) => (
                <UserCard
                key={key}
                name={user.name}
                username={user.username || ""}
                profileImage={user.profilePicture || ""}
                postCount={user.post.length}
                readersCount={user.statistic[0].readers ?? 0}
                />
            ))
            ) : (
            <Empty className="min-h-[85vh] min-w-[85vw] flex items-center justify-center">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <UserRound />
                    </EmptyMedia>

                    <EmptyTitle>
                        There are no creator yet
                    </EmptyTitle>

                    <EmptyDescription>
                        Seem`s kinda lonely here
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
            )
            }
        </main>
    )
}

export default page