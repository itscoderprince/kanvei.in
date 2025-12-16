import Link from "next/link"
import Image from "next/image"
import Header from "@/components/shared/Header"
import Footer from "@/components/shared/Footer"
import { ArrowUpRight } from "lucide-react"

// Force dynamic rendering - blog page needs runtime data
export const dynamic = 'force-dynamic'

async function getBlogs() {
  try {
    // Determine the base URL - use full URL for server-side rendering
    const baseUrl = typeof window === 'undefined'
      ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://kanvei.in')
      : '';

    const apiUrl = `${baseUrl}/api/blogs?status=published`;

    console.log('Fetching blogs from:', apiUrl);

    const response = await fetch(apiUrl, {
      cache: "no-store" // Always fetch fresh data
    });

    console.log('Blog API Response Status:', response.status);

    if (!response.ok) {
      console.error("Failed to fetch blogs, status:", response.status);
      return [];
    }

    const data = await response.json();
    console.log('Blog API Data:', data);
    console.log('Number of blogs:', data.blogs?.length || 0);

    return data.blogs || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export const metadata = {
  title: "The Edit | KANVEI",
  description: "Style guides, heritage, and the stories behind our collections.",
}

export default async function BlogPage() {
  const blogs = await getBlogs()
  const featuredBlog = blogs[0]
  const recentBlogs = blogs.slice(1)

  // E-commerce style categories - focused on content pillars
  const categories = ["All Stories", "Style Guide", "Campaigns", "Craftsmanship", "Interviews"]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white font-sans selection:bg-[#5A0117] selection:text-white">

        {/* --- PAGE HEADER --- */}
        {/* Adjusted padding and sizing for a cleaner, less "heavy" look */}
        <div className="pt-8 pb-6 px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-[#5A0117] mb-3 tracking-tight">
            The Kanvei Edit
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto uppercase tracking-widest font-medium">
            Stories, Style & Culture
          </p>
        </div>

        {/* --- MAIN CONTENT WRAPPER --- */}
        {/* Full width but with proper margins for "professional" look */}
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-8 py-4">
          {blogs.length === 0 ? (
            <div className="py-32 text-center">
              <p className="text-gray-400 font-serif italic text-lg">Stories coming soon.</p>
            </div>
          ) : (
            <>
              {/* --- HERO EDITORIAL --- */}
              {featuredBlog && (
                <div className="mb-16">
                  <Link href={`/blog/${featuredBlog.slug}`} className="group block relative w-full h-[65vh] md:h-[80vh] min-h-[500px] overflow-hidden rounded-sm">
                    <Image
                      src={featuredBlog.heroImage || "/placeholder.svg"}
                      alt={featuredBlog.title}
                      fill
                      className="object-cover object-center transition-transform duration-[1.5s] group-hover:scale-105"
                      priority
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-16 flex flex-col items-start justify-end">
                      <div className="overflow-hidden mb-4">
                        <span className="text-white/90 text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 border border-white/30 backdrop-blur-sm inline-block transform transition-transform duration-500 group-hover:-translate-y-1">
                          Featured Story
                        </span>
                      </div>
                      <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-medium mb-4 max-w-5xl leading-[1.1] drop-shadow-lg">
                        {featuredBlog.title}
                      </h2>
                      <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-8 line-clamp-2 md:line-clamp-3 font-light leading-relaxed">
                        {featuredBlog.description}
                      </p>

                      <div className="flex items-center gap-3 text-white font-semibold text-sm uppercase tracking-widest group/btn">
                        <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-white after:origin-right after:scale-x-0 group-hover:after:scale-x-100 group-hover:after:origin-left after:transition-transform after:duration-500">
                          Read The Story
                        </span>
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* --- THE GRID --- */}
              {/* 4 columns on 2xl screens for that "Full Screen" density */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-16 lg:gap-x-8 px-0 md:px-4">
                {recentBlogs.map((blog) => (
                  <Link key={blog._id} href={`/blog/${blog.slug}`} className="group block flex flex-col h-full">
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6 rounded-sm">
                      <Image
                        src={blog.heroImage || "/placeholder.svg"}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      />
                      {/* Badge Overlay */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-md text-[#5A0117] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
                          Read Article
                        </span>
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col items-center text-center flex-1">
                      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#5A0117]/80">
                        {blog.tags?.[0] || "Editorial"}
                      </div>
                      <h3 className="text-2xl font-serif text-gray-900 mb-3 group-hover:text-[#5A0117] transition-colors leading-tight px-4">
                        {blog.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 max-w-sm mb-4 font-light">
                        {blog.description}
                      </p>

                      {/* Spacer to push Date to bottom if needed, or just layout normally */}
                      <div className="mt-auto pt-2 border-t border-transparent group-hover:border-gray-100 w-12 transition-colors duration-500"></div>

                      <span className="mt-2 text-[11px] text-gray-400 font-medium uppercase tracking-widest">
                        {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}