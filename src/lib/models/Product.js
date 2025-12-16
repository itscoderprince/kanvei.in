import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    brand: { type: String, trim: true },
    slug: { type: String, trim: true, lowercase: true, index: true, unique: false },
    weight: { type: Number },
    height: { type: Number },
    width: { type: Number },
    mrp: { type: Number },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    stock: { type: Number, default: 0, index: true },
    featured: { type: Boolean, default: false, index: true },
    price: { type: Number, required: true, index: true },
  },
  { timestamps: true },
)

if (mongoose.models.Product) {
  delete mongoose.models.Product
}

const Product = mongoose.model("Product", ProductSchema)

export default Product
