import { Dot } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import Link from "next/link"
import { buttonVariants } from "./button"

type UserCardProps = {
    name: string,
    username: string,
    profileImage: string,
    postCount: number,
    readersCount: number,
}

const UserCard = ({ name, username, profileImage, postCount, readersCount }: UserCardProps) => {
    return (
        <div className="flex flex-col items-center min-w-10 min-h-30 w-full h-full p-4 bg-card border-border rounded-md shadow-card-shadow transition-all duration-250 hover:shadow-card-shadow-hover hover:-translate-y-0.5">
            <Avatar className="size-14">
                <AvatarFallback>
                    {name.at(0)}
                </AvatarFallback>

                <AvatarImage src={profileImage} />
            </Avatar>

            <span className="flex flex-col items-center justify-center mt-2">
                <h1 className="font-jakarta font-semibold text-lg text-foreground">{name}</h1>
                <p className="font-inter text-sm text-foreground/60">@{username}</p>
            </span>

            <div className="flex flex-col items-center mt-2">
                <div className="flex flex-row items-center py-2 px-4 rounded-sm">
                    <span className="flex flex-row items-center gap-2">
                        <p className="text-sm">{postCount}</p>
                        <p className="opacity-80 text-xs">Posts</p>
                    </span>

                    <Dot size={16} />

                    <span className="flex flex-row items-center gap-2">
                        <p className="text-sm">{readersCount}</p>
                        <p className="opacity-80 text-xs">Readers</p>
                    </span>
                </div>

                <Link 
                href={`/profile/${username}`}
                className={buttonVariants({ variant: "outline", className: "w-full mt-4 text-primary" })}
                >
                    View Profile
                </Link>
            </div>
        </div>
    )
}

export default UserCard