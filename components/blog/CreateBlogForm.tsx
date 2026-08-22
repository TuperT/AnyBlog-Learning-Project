"use client"

import { createBlogSchema } from "@/app/schemas/createBlog";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet 
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button, buttonVariants } from "../ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
    Attachment,
    AttachmentActions,
    AttachmentContent,
    AttachmentDescription,
    AttachmentMedia,
    AttachmentTitle 
} from "../ui/attachment";
import { SquarePlus, Upload, X } from "lucide-react";
import Markdown from "../layout/Markdown";
import {
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    linkPlugin,
    quotePlugin,
    markdownShortcutPlugin,
    toolbarPlugin,
    BoldItalicUnderlineToggles,
    CreateLink,
    UndoRedo,
    BlockTypeSelect,
    InsertTable,
    tablePlugin,
    codeBlockPlugin,
    InsertCodeBlock,
    codeMirrorPlugin,
    ListsToggle,
    linkDialogPlugin,
    StrikeThroughSupSubToggles,
    InsertThematicBreak,
    thematicBreakPlugin,
    InsertImage,
    imagePlugin,
} from "@mdxeditor/editor";

import "@mdxeditor/editor/style.css";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

type createBlogFormProps = {
    name: string,
    profilePicture: string,
}

type BlogFormValues = {
    title: string;
    description: string;
    content: string;
    image?: File;
};

const CreateBlogForm = ({ name, profilePicture }: createBlogFormProps) => {
    const [isSubmited, setIsSubmited] = useState(false)
    const router = useRouter()

    const form = useForm<BlogFormValues>({
        resolver: zodResolver(createBlogSchema),
        defaultValues: {
            title: "",
            description: "",
            content: "",
            image: undefined
        }
    })

    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [previewTime, setPreviewTime] = useState("")

    const selectedImage = form.watch("image")
    const fileName = selectedImage instanceof File ? selectedImage.name : "No file selected"

    useEffect(() => {
        setPreviewTime(new Date().toLocaleTimeString())

        return () => {
            if (previewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    const clearImage = () => {
        setPreviewUrl(null)
        form.setValue("image", undefined, {
            shouldValidate: true,
            shouldDirty: true,
        })
    }

    const onSubmit = async (data: BlogFormValues) => {
        if (!data.image || !data.title || !data.description || !data.content) {
            return toast.info("All field must be filled")
        }

        setIsSubmited(true)
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("content", data.content);
        formData.append("image", data.image || "/broken-image.png");

        const res = await fetch("/api/blog/new", {
            method: "POST",
            body: formData,
        })

        const result = await res.json();

        if (!res.ok) {
            setIsSubmited(false)
            return toast.error(result.message || "Failed to create blog");
        }

        router.push("/")
        toast.success("Blog successfully created", { duration: 5 })
    }

    return (
        <div className="mt-10 flex w-full flex-col items-start gap-8 md:flex-row">
            {/* Preview */}
            <Card className="flex w-full min-w-0 flex-col p-5 md:w-[40%]">
                {/* Card Blog Preview */}
                <h3 className="mb-3 text-sm font-medium tracking-wide text-muted-foreground uppercase">
                    Preview
                </h3>
                <Card className="overflow-hidden gap-3 pb-4 pt-0">
                    <div className="relative min-h-58 w-full overflow-hidden">
                        <Image
                            src={previewUrl ?? "/broken-image.png"}
                            alt={form.watch("title") || "Blog preview"}
                            fill
                            className="object-cover"
                            unoptimized={!!previewUrl?.startsWith("blob:")}
                        />
                    </div>

                    <CardHeader>
                        <h3 className="line-clamp-2 text-lg font-semibold leading-tight">
                            {form.watch("title") || "Title"}
                        </h3>
                    </CardHeader>

                    <CardContent className="min-h-16">
                        <p className="line-clamp-3 text-sm text-muted-foreground">
                            {form.watch("description") || "Description will appear here"}
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
                                    {previewTime}
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
                    <Markdown content={form?.watch("content")} />
                </Card>
            </Card>

            {/* Editable */}
            <Card className="w-full min-w-0 flex-1 p-5 lg:w-[60%]">
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend>Create Blog</FieldLegend>
                            <FieldDescription>Lets share something new</FieldDescription>
                        </FieldSet>

                        <FieldContent className="gap-3">
                            <Controller
                            name="image"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                <FieldLabel>Blog Image</FieldLabel>

                                <Attachment
                                    className="w-full max-w-xl"
                                    state={field.value ? "done" : "idle"}
                                >
                                    <AttachmentMedia variant={previewUrl ? "image" : "icon"} className="relative">
                                    {previewUrl ? (
                                        <Image
                                        src={previewUrl}
                                        alt="Selected image preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                        />
                                    ) : (
                                        <Upload className="h-4 w-4" />
                                    )}
                                    </AttachmentMedia>

                                    <AttachmentContent>
                                        <AttachmentTitle>{fileName}</AttachmentTitle>
                                        <AttachmentDescription>
                                            {field.value ? "Ready to upload" : "PNG, JPG, or WEBP • max 5MB"}
                                        </AttachmentDescription>
                                    </AttachmentContent>

                                    <AttachmentActions>
                                    <label
                                        htmlFor="blog-image-upload"
                                        className={buttonVariants({ variant: "outline", size: "sm" })}
                                    >
                                        Browse
                                    </label>

                                    {field.value && (
                                        <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={clearImage}
                                        aria-label="Remove selected image"
                                        >
                                        <X className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                    </AttachmentActions>

                                    <input
                                    id="blog-image-upload"
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (!file) return

                                        const url = URL.createObjectURL(file)
                                        setPreviewUrl(url)
                                        field.onChange(file)
                                    }}
                                    />
                                </Attachment>

                                {fieldState && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                            />

                            <Controller 
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Blog Title</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} placeholder="My Blog" {...field} />
                                    {fieldState && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                            />

                            <Controller 
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Blog Description</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} placeholder="Lorem Ipsum Dolor Sit Amet This Is My Blog Description" {...field} />
                                    {fieldState && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                            />

                            <MDXEditor
                            className="w-full min-w-0 rounded-lg border-2 [&_.mdxeditor-contenteditable]:min-h-80 [&_.mdxeditor-contenteditable]:px-3"
                            markdown={form.watch('content') ?? ""}
                            onChange={(value) => {
                                form.setValue('content', value)
                            }}
                            plugins={[
                                headingsPlugin(),
                                listsPlugin(),
                                linkPlugin(),
                                linkDialogPlugin(),
                                quotePlugin(),
                                tablePlugin(),
                                thematicBreakPlugin(),
                                imagePlugin(),
                                codeBlockPlugin({ defaultCodeBlockLanguage:"txt" }),
                                codeMirrorPlugin({
                                    codeBlockLanguages: {
                                        rust: "Rust",
                                        cpp: "C++",
                                        c: "C", 
                                        javascript: "JavaScript",
                                        js: "JavaScript",
                                        typescript: "TypeScript",
                                        ts: "TypeScript",
                                        tsx: "TypeScript (React)",
                                        css: "CSS",
                                        html: "HTML",
                                        python: "Python",
                                        java: "Java",
                                        go: "Go",
                                        sql: "SQL",
                                        json: "JSON",
                                    },
                                }),
                                toolbarPlugin({
                                toolbarContents: () => (
                                    <>
                                    <UndoRedo />
                                    <BoldItalicUnderlineToggles />
                                    <StrikeThroughSupSubToggles />
                                    <InsertThematicBreak />
                                    <BlockTypeSelect />
                                    <InsertImage />
                                    <CreateLink />
                                    <InsertTable />
                                    <InsertCodeBlock />
                                    <ListsToggle />
                                    </>
                                ),
                                }),
                                markdownShortcutPlugin(),
                            ]}
                            />
                        </FieldContent>
                    </FieldGroup>

                    <div className="flex mt-10 justify-end">
                        <Button
                        type="submit"
                        className={`w-[12vw] h-[6vh] ${isSubmited ? "opacity-0" : "opacity-100"}`}
                        disabled={isSubmited}
                        >
                            {isSubmited 
                            ? (<Spinner className="size-6" />) 
                            : ( 
                            <span className="flex flex-row items-center justify-center gap-1"><SquarePlus /> 
                                Create
                            </span> 
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}

export default CreateBlogForm