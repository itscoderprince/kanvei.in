import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/shared/Header"
import Footer from "@/components/shared/Footer"
import ReadingProgressBar from "@/components/blog/ReadingProgressBar"
import { Facebook, Twitter, Linkedin, Share2, ArrowRight, Clock, User as UserIcon } from "lucide-react"

async function getBlog(slug) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/blogs/slug/${slug}`,
      { cache: "no-store" },
    )
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error("Error fetching blog:", error)
    return null
  }
}

async function getRelatedBlogs(currentSlug, tags = []) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/blogs?published=true&limit=3`,
      { cache: "no-store" },
    )
    if (!response.ok) return []
    const data = await response.json()
    return (data.blogs || []).filter((blog) => blog.slug !== currentSlug).slice(0, 3)
  } catch (error) {
    console.error("Error fetching related blogs:", error)
    return []
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const blog = await getBlog(slug)
  if (!blog) return { title: "Blog Not Found - KANVEI" }

  return {
    title: blog.metaTitle || `${blog.title} - KANVEI Journal`,
    description: blog.metaDescription || blog.description,
    keywords: blog.tags?.join(", "),
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: blog.heroImage ? [blog.heroImage] : [],
      type: "article",
    },
  }
}

export default async function BlogPost({ params }) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog || !blog.published) {
    notFound()
  }

  const relatedBlogs = await getRelatedBlogs(blog.slug, blog.tags)

  const getYouTubeEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch?v=')) return url.replace('youtube.com/watch?v=', 'youtube.com/embed/')
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/')
    return url
  }

  return (
    <>
      <ReadingProgressBar />

      {/* Sticky Navigation Bar */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-serif font-bold text-[#5A0117] tracking-tight hover:opacity-80 transition-opacity">
              Kanvei
            </Link>
            <div className="flex items-center gap-4 hidden md:flex">
              <span className="text-sm text-gray-400 border-r border-gray-200 pr-4 truncate max-w-[200px]">
                {blog.title}
              </span>
              <Link href="/blog" className="text-sm font-medium text-gray-900 hover:text-[#5A0117] transition-colors">
                Back to Journal
              </Link>
              <a href="/products" className="ml-2 bg-[#5A0117] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#5A0117]/90 transition-colors shadow">
                Shop Collection
              </a>
            </div>
            {/* Mobile CTA */}
            <a href="/products" className="md:hidden bg-[#5A0117] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
              Shop
            </a>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-white font-sans selection:bg-[#5A0117] selection:text-white">

        {/* --- ARTICLE HEADER --- */}
        <header className="max-w-[1400px] mx-auto px-4 pt-16 pb-12 text-center">
          {/* Meta */}
          <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-[#5A0117] mb-6">
            <span>{blog.tags?.[0] || 'Editorial'}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-gray-900 mb-8 leading-[1.1] max-w-5xl mx-auto">
            {blog.title}
          </h1>

          {/* Authors & Read Time */}
          <div className="flex items-center justify-center gap-6 text-gray-500 text-sm font-medium mb-12">
            <div className="flex items-center gap-2">
              <UserIcon size={16} />
              <span>By {blog.author || 'The Editorial'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{blog.readTime || 5} min read</span>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto border-t border-gray-100 pt-8">
            {blog.subtitle || blog.description}
          </p>
        </header>

        {/* --- HERO IMAGE --- */}
        {/* Full width container, slightly padded on sides for "Framed" look */}
        {blog.heroImage && (
          <div className="max-w-[1600px] mx-auto px-4 mb-16 md:mb-24">
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-sm overflow-hidden shadow-sm">
              <Image
                src={blog.heroImage}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* --- CONTENT LAYOUT --- */}
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 pb-24">

          {/* LEFT: Main Content (8 cols) */}
          <div className="lg:col-span-8 lg:col-start-2 xl:col-span-7 xl:col-start-3">
            <div className="prose prose-lg prose-headings:font-serif prose-headings:font-medium prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-8 prose-p:font-light prose-a:text-[#5A0117] prose-a:no-underline prose-a:border-b prose-a:border-[#5A0117]/30 hover:prose-a:border-[#5A0117] prose-img:rounded-sm prose-blockquote:border-l-[#5A0117] prose-blockquote:text-xl prose-blockquote:italic prose-blockquote:font-serif max-w-none">
              <div className="first-letter:text-6xl first-letter:font-serif first-letter:text-[#5A0117] first-letter:float-left first-letter:mr-3 first-letter:mt-[-5px] first-letter:font-bold">
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>
            </div>

            {/* Video Embeds */}
            {blog.youtubeLinks?.length > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl font-serif text-gray-900 mb-6">Featured Video</h3>
                <div className="grid gap-8">
                  {blog.youtubeLinks.map((link, idx) => (
                    <div key={idx} className="aspect-video rounded-sm overflow-hidden shadow-md bg-black">
                      <iframe
                        src={getYouTubeEmbedUrl(link)}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio Section */}
            <div className="mt-20 border-t border-gray-100 pt-12 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-20 h-20 rounded-full bg-gray-100 relative overflow-hidden flex-shrink-0">
                <Image src={blog.authorImage || "https://api.dicebear.com/7.x/notionists/svg?seed=Felix"} alt="Author" fill className="object-cover" />
              </div>
              <div>
                <h4 className="text-lg font-serif font-bold text-gray-900 mb-2">Written by {blog.author || 'Kanvei Editorial'}</h4>
                <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                  {blog.authorBio || "Exploring the intersection of craftsmanship, heritage, and modern design. Curating stories for the thoughtful minimalist."}
                </p>
                <Link href="/blog" className="inline-block mt-4 text-xs font-bold uppercase tracking-widest text-[#5A0117] hover:underline">
                  View all articles
                </Link>
              </div>
            </div>

          </div>

          {/* RIGHT: Sidebar (Sticky) - Share & Context */}
          <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <div className="sticky top-32 space-y-12">
              {/* Share */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Share Story</h5>
                <div className="flex flex-col gap-4">
                  <button className="flex items-center gap-3 text-gray-500 hover:text-[#1877F2] transition-colors group">
                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#1877F2]"><Facebook size={16} /></div>
                    <span className="text-sm font-medium">Facebook</span>
                  </button>
                  <button className="flex items-center gap-3 text-gray-500 hover:text-[#1DA1F2] transition-colors group">
                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#1DA1F2]"><Twitter size={16} /></div>
                    <span className="text-sm font-medium">Twitter</span>
                  </button>
                  <button className="flex items-center gap-3 text-gray-500 hover:text-[#0A66C2] transition-colors group">
                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#0A66C2]"><Linkedin size={16} /></div>
                    <span className="text-sm font-medium">LinkedIn</span>
                  </button>
                </div>
              </div>

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Topics</h5>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map(tag => (
                      <span key={tag} className="text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Shop CTA Mockup */}
              <div className="bg-[#FDFBF7] p-6 rounded-sm border border-[#DBCCB7]/30 text-center">
                <h5 className="font-serif text-lg text-[#5A0117] mb-2">Inspired by the look?</h5>
                <p className="text-xs text-gray-500 mb-4">Discover our latest sustainable collection.</p>
                <a href="/products" className="block w-full py-3 bg-[#5A0117] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#5A0117]/90 transition-colors">
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* --- RELATED GRID --- */}
        {relatedBlogs.length > 0 && (
          <div className="bg-[#F9F9F9] py-24 border-t border-gray-200">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-12">
                <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                  Continue Reading
                </h2>
                <Link href="/blog" className="hidden md:block text-sm font-bold uppercase tracking-widest text-[#5A0117] hover:underline">
                  View All Stories
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedBlogs.map((related) => (
                  <Link key={related._id} href={`/blog/${related.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 mb-6 rounded-sm">
                      <Image
                        src={related.heroImage || "/placeholder.svg"}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="pr-4">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
                        {new Date(related.publishedAt).toLocaleDateString()}
                      </div>
                      <h3 className="text-xl font-serif font-medium text-gray-900 mb-3 group-hover:text-[#5A0117] transition-colors leading-tight">
                        {related.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                        {related.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
