"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "@base-ui/react"

type blogCommentCardProps = {
    key: number
    authorProfilePicture: string
    authorName: string
    date: Date
    comment: string
}

const BlogCommentCard = (
    { 
        key,
        authorProfilePicture,
        authorName,
        comment,
        date,
    }
    : blogCommentCardProps 
    ) => {
    const currentDate: number = new Date().getTime()
    const [isReadMoreClicked, setIsReadMoreClicked] = useState(false)

    return (
        <div key={key} className="flex flex-row gap-2">
            <Avatar className="border-2 border-primary">
                <AvatarImage
                src={authorProfilePicture}
                alt="author profile picture comment"
                />
                
                <AvatarFallback>{authorName.at(0)}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1 w-full h-10vh border border-border bg-secondary text-primary py-2 px-3 rounded-md">
                <span className="leading-tight">
                    <p className="text-md font-semibold">
                        {authorName}
                    </p>

                    <p className="text-[0.6rem] opacity-50">
                        {
                        Math.floor((currentDate - new Date(date).getTime()) / 1000) < 60
                        ? /* if below 60 seconds */
                        new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
                        .format(Math.floor((new Date(date).getTime() - currentDate)), "seconds")
                        : 
                        Math.floor((currentDate - new Date(date).getTime()) / 1000 / 60) < 60
                        ? /* if below 60 minutes */
                        new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
                        .format(Math.floor((new Date(date).getTime() - currentDate) / 1000 / 60), "minutes")
                        : 
                        Math.floor((currentDate - new Date(date).getTime()) / 1000 / 60 / 24) < 24
                        ? /* if below 24 hours */
                        new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
                        .format(Math.floor((new Date(date).getTime() - currentDate) / 1000 / 60 / 24), "hours")
                        : date.toLocaleDateString()
                        }
                    </p>
                </span>

                {
                    comment.length < 200 || isReadMoreClicked === true
                    ? (
                        <p className="text-sm opacity-80">
                            {comment}
                        </p>
                    )
                    : (
                        <span>
                            <p className="text-sm opacity-80 line-clamp-6">
                                {comment}
                            </p>

                            <Button 
                            className="text-sm"
                            onClick={() => setIsReadMoreClicked(true)}>
                                Read more
                            </Button>
                        </span>
                    )
                }

            </div>
        </div>
    )
}

export default BlogCommentCard