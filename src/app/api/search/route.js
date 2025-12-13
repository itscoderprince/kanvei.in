import connectDB from "../../../lib/mongodb"
import Product from "../../../lib/models/Product"
import ProductImage from "../../../lib/models/ProductImage"

export async function GET(request) {
    try {
        await connectDB()
        const { searchParams } = new URL(request.url)
        const query = searchParams.get("q")

        if (!query || query.length < 2) {
            return Response.json({ success: true, results: [] })
        }

        // Find products matching name, description, brand, or SKU
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { brand: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ]
        })
            .select('name price slug brand categoryId images')
            .limit(6)
            .lean()

        // Fetch primary image for each product
        const productIds = products.map(p => p._id)
        const images = await ProductImage.find({
            productId: { $in: productIds }
        }).lean()

        // Map images to products
        const imageMap = {}
        images.forEach(img => {
            if (!imageMap[img.productId]) {
                imageMap[img.productId] = img.img[0] // Get first image
            }
        })

        const results = products.map(p => ({
            _id: p._id,
            name: p.name,
            price: p.price,
            brand: p.brand,
            slug: p.slug,
            image: imageMap[p._id] || '/placeholder.svg?height=100&width=100'
        }))

        return Response.json({ success: true, results })
    } catch (error) {
        console.error('Search API Error:', error)
        return Response.json({ success: false, error: 'Search failed' }, { status: 500 })
    }
}
