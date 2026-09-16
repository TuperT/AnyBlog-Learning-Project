import Footer from "@/components/layout/Footer"
import NavBar from "@/components/layout/NavBar"

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen flex-col">
            <NavBar />
            <div className="flex-1">
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default layout