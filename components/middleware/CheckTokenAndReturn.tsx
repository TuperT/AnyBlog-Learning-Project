import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

type checkTokenAndReturnProps = {
    successChildren: React.ReactNode,
    failedChildren?: React.ReactNode
}

const CheckTokenAndReturn = async ({ successChildren, failedChildren }: checkTokenAndReturnProps) => {
    const token = (await cookies()).get("jwt")?.value

    if (!token) {
        return <>{failedChildren ?? null}</>
    }

    if (!process.env.JWT_SECRET) {
        return <>{failedChildren ?? null}</>
    }

    let tokenIsValid = false

    try {
        jwt.verify(token, process.env.JWT_SECRET)
        tokenIsValid = true
    } catch {
        tokenIsValid = false
    }

    return tokenIsValid ? <>{successChildren}</> : <>{failedChildren ?? null}</>
}

export default CheckTokenAndReturn