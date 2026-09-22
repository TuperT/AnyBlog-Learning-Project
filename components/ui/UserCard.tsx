import { Dot } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import Link from "next/link"
import { buttonVariants } from "./button"
import { formatNumber } from "@/lib/utils"

type UserCardProps = {
    name: string,
    username: string,
    shortDesc: string,
    profileImage: string,
    postCount: number,
    readersCount: number,
}

const UserCard = ({ name, username, shortDesc, profileImage, postCount, readersCount }: UserCardProps) => {
    return (
        <div className="flex flex-col items-center min-w-10 min-h-30 w-full h-full p-4 bg-card border-2 border-border rounded-md shadow-card-shadow transition-all duration-250 hover:shadow-card-shadow-hover hover:-translate-y-0.5">
            <Avatar className="size-14">
                <AvatarFallback>
                    {name.at(0)}
                </AvatarFallback>

                <AvatarImage src={profileImage} />
            </Avatar>

            <span className="flex flex-col items-center justify-center mt-2">
                <h1 className="font-jakarta font-semibold text-lg text-foreground leading-tight">{name}</h1>
                <p className="font-inter text-sm text-muted-foreground">@{username}</p>

                <p className="font-inter text-sm text-muted-foreground text-center mt-2 line-clamp-2">{shortDesc}</p>
            </span>

            <div className="flex flex-col items-center">
                <div className="flex flex-row items-center py-2 px-4 rounded-sm">
                    <span className="flex flex-row items-center gap-1">
                        <p className="text-sm">{formatNumber(postCount)}</p>
                        <p className="opacity-80 text-xs">Posts</p>
                    </span>

                    <Dot size={16} />

                    <span className="flex flex-row items-center gap-1">
                        <p className="text-sm">{formatNumber(readersCount)}</p>
                        <p className="opacity-80 text-xs">Readers</p>
                    </span>
                </div>

                <Link 
                href={`/profile/${username}`}
                prefetch={true}
                className={buttonVariants({ variant: "default", className: "w-full mt-2 text-primary" })}
                >
                    View Profile
                </Link>
            </div>
        </div>
    )
}

export default UserCard