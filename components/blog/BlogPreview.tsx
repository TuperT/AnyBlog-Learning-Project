import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import Markdown from "../layout/Markdown"

type blogPreviewProps = {
    title: string,
    description: string,
    content: string,
    previewUrl: string,
    profilePicture: string,
    name: string,
}

const BlogPreview = ({ title, description, content, previewUrl, profilePicture, name }: blogPreviewProps) => {
    const currentTime = new Date().toLocaleString()

    return (
            <Card className="flex w-full min-w-0 flex-col p-5 md:w-[40%]">
                {/* Card Blog Preview */}
                <h3 className="mb-3 text-sm font-medium tracking-wide text-muted-foreground uppercase">
                    Preview
                </h3>
                <Card className="overflow-hidden gap-3 pb-4 pt-0">
                    <div className="relative min-h-58 w-full overflow-hidden">
                        <Image
                            src={previewUrl ?? "/broken-image.png"}
                            alt={title || "Blog preview"}
                            fill
                            className="object-cover"
                            unoptimized={!!previewUrl?.startsWith("blob:")}
                        />
                    </div>

                    <CardHeader>
                        <h3 className="line-clamp-2 text-lg font-semibold leading-tight">
                            {title || "Title"}
                        </h3>
                    </CardHeader>

                    <CardContent className="min-h-16">
                        <p className="line-clamp-3 text-sm text-muted-foreground">
                            {description || "Description will appear here"}
                        </p>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between text-xs h-full">
                        <span className="flex flex-row gap-2">
                            <Avatar>
                                {profilePicture && (
                                    <AvatarImage
                                    src={profilePicture}
                                    alt="user blog profile picture"
                                    />
                                )}

                                <AvatarFallback>
                                    {name?.charAt(0 )}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                                {name}
                                <br />
                                <p className="text-muted-foreground font-normal">
                                    {currentTime}
                                </p>
                            </span>
                        </span>
                        <span className="flex items-center gap-5">
                            <Button variant="default">Read Blog</Button>
                        </span>
                    </CardFooter>
                </Card>
                {/* Card Content Preview */}
            
                <Card className="p-5">
                    <Markdown content={content} />
                </Card>
            </Card>
    )
}

export default BlogPreview