"use client"
import { useState, useEffect } from "react"
import BlogImageUpload from "../BlogImageUpload"
import {
  Type,
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  Youtube,
  Tag,
  User,
  Globe,
  AlignLeft,
  Save,
  X,
  Plus,
  Trash2,
  Layout,
  Type as SubtitleIcon
} from "lucide-react"

export default function BlogForm({ blog = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    heroImage: "",
    heroImagePublicId: "",
    description: "",
    subtitle: "",
    content: "",
    youtubeLinks: [""],
    additionalLinks: [{ title: "", url: "" }],
    author: "Kanvei Team",
    tags: "",
    published: false,
    metaTitle: "",
    metaDescription: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        heroImage: blog.heroImage || "",
        description: blog.description || "",
        subtitle: blog.subtitle || "",
        content: blog.content || "",
        youtubeLinks: blog.youtubeLinks?.length ? blog.youtubeLinks : [""],
        additionalLinks: blog.additionalLinks?.length ? blog.additionalLinks : [{ title: "", url: "" }],
        author: blog.author || "",
        tags: blog.tags?.join(", ") || "",
        published: blog.published || false,
        metaTitle: blog.metaTitle || "",
        metaDescription: blog.metaDescription || "",
      })
    }
  }, [blog])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleYoutubeLinkChange = (index, value) => {
    const newLinks = [...formData.youtubeLinks]
    newLinks[index] = value
    setFormData((prev) => ({ ...prev, youtubeLinks: newLinks }))
  }

  const addYoutubeLink = () => {
    setFormData((prev) => ({
      ...prev,
      youtubeLinks: [...prev.youtubeLinks, ""],
    }))
  }

  const removeYoutubeLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      youtubeLinks: prev.youtubeLinks.filter((_, i) => i !== index),
    }))
  }

  const handleAdditionalLinkChange = (index, field, value) => {
    const newLinks = [...formData.additionalLinks]
    newLinks[index][field] = value
    setFormData((prev) => ({ ...prev, additionalLinks: newLinks }))
  }

  const addAdditionalLink = () => {
    setFormData((prev) => ({
      ...prev,
      additionalLinks: [...prev.additionalLinks, { title: "", url: "" }],
    }))
  }

  const removeAdditionalLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      additionalLinks: prev.additionalLinks.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submitData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        youtubeLinks: formData.youtubeLinks.filter(Boolean),
        additionalLinks: formData.additionalLinks.filter((link) => link.title && link.url),
      }

      await onSubmit(submitData)
    } catch (error) {
      console.error("Error submitting blog:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-[#5A0117] px-8 py-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold font-serif tracking-wide">
                {blog ? "Edit Blog Post" : "Create New Blog Post"}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Fill in the details below to {blog ? "update the" : "publish a new"} article
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <FileText size={24} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {/* Section 1: Basic Information */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-[#5A0117] border-b border-gray-100 pb-2">
                <Layout size={20} />
                <h3 className="text-lg font-semibold">Basic Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Type size={16} className="text-[#5A0117]" />
                      Blog Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter an engaging title"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A0117] focus:border-transparent transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <SubtitleIcon size={16} className="text-[#5A0117]" />
                      Subtitle
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      placeholder="A short tagline or subtitle"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A0117] focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <LinkIcon size={16} className="text-[#5A0117]" />
                      Slug
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="auto-generated-from-title"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A0117] focus:border-transparent transition-all outline-none"
                    />
                    <p className="text-xs text-gray-400 mt-1 ml-1">Leave empty to auto-generate from title</p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <User size={16} className="text-[#5A0117]" />
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A0117] focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Visual & Media */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-[#5A0117] border-b border-gray-100 pb-2">
                <ImageIcon size={20} />
                <h3 className="text-lg font-semibold">Visual Assets</h3>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  Hero Image (1000x1000px)
                </label>
                <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#5A0117]/30 transition-colors">
                  <BlogImageUpload
                    value={formData.heroImage}
                    onChange={(imageData) => {
                      if (typeof imageData === 'object' && imageData.url) {
                        setFormData((prev) => ({
                          ...prev,
                          heroImage: imageData.url,
                          heroImagePublicId: imageData.publicId
                        }))
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          heroImage: imageData,
                          heroImagePublicId: ''
                        }))
                      }
                    }}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </section>

            {/* Section 3: Content */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-[#5A0117] border-b border-gray-100 pb-2">
                <AlignLeft size={20} />
                <h3 className="text-lg font-semibold">Content</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A0117] focus:border-transparent transition-all outline-none resize-none"
                  placeholder="A brief summary for cards and previews..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={15}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A0117] focus:border-transparent transition-all outline-none"
                  placeholder="Write your amazing blog content here..."
                />
              </div>
            </section>

            {/* Section 4: External Links */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-[#5A0117] border-b border-gray-100 pb-2">
                <Globe size={20} />
                <h3 className="text-lg font-semibold">External Links & Media</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Youtube Links */}
                <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Youtube size={18} className="text-red-600" />
                    YouTube Embeds
                  </label>
                  <div className="space-y-3">
                    {formData.youtubeLinks.map((link, index) => (
                      <div key={index} className="flex gap-2 group">
                        <input
                          type="url"
                          value={link}
                          onChange={(e) => handleYoutubeLinkChange(index, e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5A0117] focus:border-transparent text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeYoutubeLink(index)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addYoutubeLink}
                      className="flex items-center gap-2 text-sm text-[#5A0117] font-medium hover:underline pl-1"
                    >
                      <Plus size={16} /> Add Video Link
                    </button>
                  </div>
                </div>

                {/* Additional Links */}
                <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <LinkIcon size={18} className="text-blue-600" />
                    Related Links
                  </label>
                  <div className="space-y-3">
                    {formData.additionalLinks.map((link, index) => (
                      <div key={index} className="space-y-2 p-3 bg-white rounded-lg border border-gray-200 group relative">
                        <input
                          type="text"
                          value={link.title}
                          onChange={(e) => handleAdditionalLinkChange(index, "title", e.target.value)}
                          placeholder="Link Title (e.g. Source)"
                          className="w-full px-3 py-1.5 bg-gray-50 border-none rounded focus:ring-1 focus:ring-[#5A0117] text-sm font-medium"
                        />
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => handleAdditionalLinkChange(index, "url", e.target.value)}
                          placeholder="https://example.com"
                          className="w-full px-3 py-1.5 bg-gray-50 border-none rounded focus:ring-1 focus:ring-[#5A0117] text-sm text-gray-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeAdditionalLink(index)}
                          className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addAdditionalLink}
                      className="flex items-center gap-2 text-sm text-[#5A0117] font-medium hover:underline pl-1"
                    >
                      <Plus size={16} /> Add Resource Link
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: SEO and Metadata */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-[#5A0117] border-b border-gray-100 pb-2">
                <Tag size={20} />
                <h3 className="text-lg font-semibold">SEO & Metadata</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                    placeholder="SEO Title (defaults to blog title)"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A0117] focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="fashion, classic, winter (comma separated)"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A0117] focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A0117] focus:border-transparent transition-all outline-none"
                    placeholder="Brief description for search engines..."
                  />
                </div>
              </div>
            </section>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-12 h-6 rounded-full transition-colors duration-200 flex items-center px-1 ${formData.published ? 'bg-[#5A0117]' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${formData.published ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
                <input
                  type="checkbox"
                  name="published"
                  id="published"
                  checked={formData.published}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#5A0117] transition-colors">
                  {formData.published ? 'Published Immediately' : 'Save as Draft'}
                </span>
              </label>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 font-medium transition-all flex items-center gap-2"
                >
                  <X size={18} /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-3 bg-[#5A0117] text-white rounded-xl hover:bg-[#5A0117]/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-medium flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  <Save size={18} />
                  {isSubmitting ? "Saving..." : blog ? "Update Post" : "Publish Post"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
