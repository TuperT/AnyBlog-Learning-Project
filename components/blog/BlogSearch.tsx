"use client"

import { Search } from "lucide-react"
import { Field, FieldGroup } from "../ui/field"
import { Input } from "../ui/input"
import { ButtonGroup } from "../ui/button-group"
import { Button } from "../ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"

const BlogSearch = () => {
    const router = useRouter()

    const [data, setData] = useState("")

    const handleQuery = () => {
        const params = new URLSearchParams()

        if (data.trim()) {
            params.set("search", data)
        }

        router.push(`?${params.toString()}`)
    }

    return (
        <FieldGroup>
            <Field className="flex flex-row">
                <ButtonGroup>
                    <Input
                    type="text"
                    placeholder="Blog name"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleQuery}>
                        <Search />
                    </Button>
                </ButtonGroup>
            </Field>
        </FieldGroup>
    )
}

export default BlogSearch