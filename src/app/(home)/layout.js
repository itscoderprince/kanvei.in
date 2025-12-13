import Header from "../../components/shared/Header"
import Footer from "../../components/shared/Footer"

export default function HomeLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}
