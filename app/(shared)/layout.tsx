import Footer from "@/components/layout/Footer"
import NavBar from "@/components/layout/NavBar"

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
    <>
    <NavBar />
    <div className="h-[85dvh]">
        {children}
    </div>
    <Footer />
    </>
    )
}

export default layout