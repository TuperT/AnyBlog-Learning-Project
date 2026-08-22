"use client"

import { loginSchema } from "@/app/schemas/auth"
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
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    async function onSubmit(data: { email: string, password: string }) {
        const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        const message = typeof result === "string" ? result : result?.message;

        if (!res.ok) {
            toast.error(message || "Login failed");
            return;
        }

        toast.success(message || "Login success", { duration: 5 })

        router.push("/")
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Login to your account</CardDescription>
            </CardHeader>

            <Separator />

            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup >
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

                        <Button type="submit">Login</Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}

export default Page