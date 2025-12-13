import Header from "../../components/shared/Header"
import Footer from "../../components/shared/Footer"
import Breadcrumbs from "../../components/shared/Breadcrumbs"

export default function ShopLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <Breadcrumbs />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}
