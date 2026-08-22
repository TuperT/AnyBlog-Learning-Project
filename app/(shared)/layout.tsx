import NavBar from "@/components/layout/NavBar"

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <NavBar />
            {children}
        </>
    )
}

export default layout