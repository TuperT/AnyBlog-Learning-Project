"use client"

import { Field, FieldContent, FieldError, FieldGroup } from '../ui/field'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { SendHorizonal } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { commentSchema } from '@/app/schemas/blog'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type blogCommentFormProps = {
    postId: string
}

const BlogCommentForm = ({ postId }: blogCommentFormProps) => {
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            comment: ""
        }
    })


    const handleCommentFormPost = async () => {
        if (!form.getValues("comment")) return;

        const comment = form.getValues("comment")

        form.reset()

        const res = await fetch("/api/blog/create-comment", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comment: comment,
                postId: postId,
            })
        })

        const result = await res.json();
        if (!res.ok) return toast.error(result.message || "Failed to send comment")
        
        toast.success("Comment posted")
        router.refresh()
    }

    return (
        <aside>
            <form onSubmit={form.handleSubmit(handleCommentFormPost)}>
                <FieldGroup>
                    <FieldContent>
                        <Controller
                        name='comment'
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <Textarea
                                id="textarea-message"
                                placeholder="Type your comment here." 
                                aria-invalid={fieldState.invalid}
                                {...field}
                                />
                                {fieldState && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                        />
                    </FieldContent>

                    <Button
                    type='submit'
                    className="w-full"
                    >
                        <SendHorizonal /> Send
                    </Button>
                </FieldGroup>
            </form>
        </aside>
    )
}

export default BlogCommentForm