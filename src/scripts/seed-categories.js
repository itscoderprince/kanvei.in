import connectDB from "../lib/mongodb.js"
import Category from "../lib/models/Category.js"

const categories = [
  {
    name: "Stationery",
    description:
      "Premium writing instruments, notebooks, and office supplies crafted for professionals and students who value quality.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    name: "Jewellery",
    description:
      "Exquisite jewelry pieces featuring timeless designs and exceptional craftsmanship for every special occasion.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    name: "Women's Wear",
    description:
      "Sophisticated fashion collection for the modern woman, combining style, comfort, and elegance in every piece.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    name: "Men's Wear",
    description:
      "Contemporary menswear essentials designed for the discerning gentleman who appreciates quality and style.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    name: "Kids Wear",
    description:
      "Comfortable and stylish clothing for children, designed with care for growing kids who love to play and explore.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    name: "Cosmetics",
    description:
      "Premium beauty products and cosmetics to enhance your natural radiance with high-quality formulations.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    name: "Electronics",
    description:
      "Explore the future with our curated collection of high-performance electronics. From state-of-the-art smart home devices to premium audio gear and wearables, discover technology that seamlessly blends innovation with sophisticated design.",
    image: "/electronics.png",
  },
]

async function seedCategories() {
  try {
    console.log("Connecting to database...")
    await connectDB()

    console.log("Clearing existing categories...")
    await Category.deleteMany({})

    console.log("Seeding KANVEI business categories...")

    for (const categoryData of categories) {
      const category = await Category.create(categoryData)
      console.log(`✓ Created category: ${category.name}`)
    }

    console.log(`\n🎉 Successfully seeded ${categories.length} categories for KANVEI!`)
    console.log("\nCategories added:")
    categories.forEach((cat) => console.log(`  • ${cat.name}`))
  } catch (error) {
    console.error("Error seeding categories:", error)
  }
}

// Run the seeding function
seedCategories()
