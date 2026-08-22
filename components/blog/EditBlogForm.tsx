import { Controller, UseFormReturn } from "react-hook-form"
import { Card } from "../ui/card"
import { 
    Field,
    FieldContent, 
    FieldDescription, 
    FieldError, 
    FieldGroup, 
    FieldLabel, 
    FieldLegend, 
    FieldSet } from "../ui/field"
import {
    Attachment,
    AttachmentActions,
    AttachmentContent,
    AttachmentDescription,
    AttachmentMedia,
    AttachmentTitle } from "../ui/attachment"
import { Save, Upload, X } from "lucide-react"
import { Button, buttonVariants } from "../ui/button"
import { Input } from "../ui/input"
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
import { Spinner } from "../ui/spinner"
import { BlogFormValues } from "./EditBlog"
import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type editBlogFormProps = {
    form: UseFormReturn<BlogFormValues>
    fileName: string
    id: string
}

const EditBlogForm = ({ form, fileName, id }: editBlogFormProps) => {
    const [isSubmited, setIsSubmited] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const router = useRouter()

    const onSubmit = async (data: BlogFormValues) => {
        if (!data.title || !data.description || !data.content) {
            return toast.info("All field must be filled")
        }

        setIsSubmited(true)
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("content", data.content);
        formData.append("image", data.image || "/broken-image.png");
        formData.append("postId", id)

        const res = await fetch("/api/blog/update", {
            method: "PUT",
            body: formData,
        })

        const result = await res.json();

        if (!res.ok) {
            setIsSubmited(false)
            return toast.error(result.message || "Failed to save blog");
        }

        router.push("/")
        toast.success("Blog successfully save", { duration: 5 })
    }

    const clearImage = () => {
        setPreviewUrl(null)
        form.setValue("image", undefined, {
            shouldValidate: true,
            shouldDirty: true,
        })
    }

    return (
        <Card className="w-full min-w-0 flex-1 p-5 lg:w-[60%]">
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend>Edit Blog</FieldLegend>
                        <FieldDescription>Lets change things</FieldDescription>
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
                        <span className="flex flex-row items-center justify-center gap-1">
                            <Save /> Save
                        </span> 
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    )
}

export default EditBlogForm