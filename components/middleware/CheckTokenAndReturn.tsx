import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

type checkTokenAndReturnProps = {
    successChildren: React.ReactNode,
    failedChildren?: React.ReactNode
}

const CheckTokenAndReturn = async ({ successChildren, failedChildren }: checkTokenAndReturnProps) => {
    const token = (await cookies()).get("jwt")?.value

    if (!token) {
        return <>{failedChildren}</>
    }

    if (!process.env.JWT_SECRET) return null

    if (!jwt.verify(token, process.env.JWT_SECRET)) return <>{successChildren}</>

    return <>{failedChildren}</>
}

export default CheckTokenAndReturn