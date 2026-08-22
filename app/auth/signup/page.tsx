"use client"

import { signUpSchema } from "@/app/schemas/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

const Page = () => {
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    })

    async function onSubmit(data: { name: string, email: string, password: string }) {
        const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        const message = typeof result === "string" ? result : result?.message;

        if (!res.ok) {
            toast.error(message || "Signup failed");
            return;
        }

        toast.success(message || "Successfully signup", { duration: 5 })

        router.push("/")
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Sign up for an account</CardDescription>
            </CardHeader>

            <Separator />

            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup >
                        <Controller
                        name="name" 
                        control={form.control} 
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Full Name</FieldLabel>
                                <Input aria-invalid={fieldState.invalid} placeholder="John Doe" {...field} />
                                {fieldState && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )} />

                        <Controller
                        name="email" 
                        control={form.control} 
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Email Address</FieldLabel>
                                <Input aria-invalid={fieldState.invalid} placeholder="johndoe@email.com" type="email" {...field} />
                                {fieldState && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )} />

                        <Controller
                        name="password" 
                        control={form.control} 
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Password</FieldLabel>
                                <Input aria-invalid={fieldState.invalid} placeholder="*********" type="password" {...field} />
                                {fieldState && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )} />

                        <Button type="submit">Sign Up</Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}

export default Page