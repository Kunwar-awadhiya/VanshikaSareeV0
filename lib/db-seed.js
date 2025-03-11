
import { MongoClient } from "mongodb"
import { randomUUID } from "crypto"

// Replace this with your MongoDB connection string
const uri = process.env.MONGODB_URI || "mongodb+srv://keven3605y:3lBAaYlLnrMGqXNw@cluster0.ld2av.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

async function seedDatabase() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("elegance")

    // Create collections if they don't exist
    await db.createCollection("products")
    await db.createCollection("users")
    await db.createCollection("orders")
    await db.createCollection("carts")
    await db.createCollection("wishlists")

    // Check if products already exist
    const productsCount = await db.collection("products").countDocuments()

    if (productsCount > 0) {
      console.log(`Database already has ${productsCount} products. Skipping seed.`)
      return
    }

    // Sample product data
    const products = [
      {
        productid: randomUUID(),
        image: "/placeholder.svg?height=600&width=450",
        Name: "Floral Embroidered Saree",
        Category: "saree",
        Price: 4999,
        Tags: ["new arrival", "featured"],
        Quantity: {
          "Free Size": 15,
        },
        Description: {
          Color: "Pink",
          Collection: "Summer Collection",
          Material: "Silk",
          Work: "Embroidery",
          Occasion: ["Wedding", "Party"],
          Wash_care: "Dry clean only",
          Length: 5.5,
          Blouse: 0.8,
          Pattern: "Floral",
        },
      },
      {
        productid: randomUUID(),
        image: "/placeholder.svg?height=600&width=450",
        Name: "Printed Cotton Kurti",
        Category: "kurti",
        Price: 1499,
        Tags: ["sale", "ready to wear"],
        Quantity: {
          S: 5,
          M: 8,
          L: 10,
          XL: 7,
        },
        Description: {
          Color: "Blue",
          Collection: "Casual Wear",
          Material: "Cotton",
          Work: "Printed",
          Occasion: ["Daily", "Office"],
          Wash_care: "Machine wash cold",
          Length: 1.2,
          Blouse: 0,
          Pattern: "Geometric",
        },
      },
      {
        productid: randomUUID(),
        image: "/placeholder.svg?height=600&width=450",
        Name: "Designer Party Gown",
        Category: "gowns",
        Price: 6999,
        Tags: ["premium", "ready to wear"],
        Quantity: {
          S: 3,
          M: 5,
          L: 4,
          XL: 2,
        },
        Description: {
          Color: "Maroon",
          Collection: "Evening Wear",
          Material: "Georgette",
          Work: "Sequins",
          Occasion: ["Party", "Wedding"],
          Wash_care: "Dry clean only",
          Length: 1.5,
          Blouse: 0,
          Pattern: "Solid",
        },
      },
      {
        productid: randomUUID(),
        image: "/placeholder.svg?height=600&width=450",
        Name: "Embellished Kurta Set",
        Category: "kurta set",
        Price: 3999,
        Tags: ["new arrival", "ready to wear"],
        Quantity: {
          S: 6,
          M: 10,
          L: 8,
          XL: 4,
        },
        Description: {
          Color: "Teal",
          Collection: "Festive Collection",
          Material: "Silk Blend",
          Work: "Embellished",
          Occasion: ["Festival", "Party"],
          Wash_care: "Dry clean only",
          Length: 1.2,
          Blouse: 0,
          Pattern: "Traditional",
        },
      },
      {
        productid: randomUUID(),
        image: "/placeholder.svg?height=600&width=450",
        Name: "Banarasi Silk Saree",
        Category: "saree",
        Price: 8999,
        Tags: ["premium", "featured"],
        Quantity: {
          "Free Size": 8,
        },
        Description: {
          Color: "Red",
          Collection: "Wedding Collection",
          Material: "Banarasi Silk",
          Work: "Zari",
          Occasion: ["Wedding", "Festival"],
          Wash_care: "Dry clean only",
          Length: 5.5,
          Blouse: 0.8,
          Pattern: "Traditional",
        },
      },
      {
        productid: randomUUID(),
        image: "/placeholder.svg?height=600&width=450",
        Name: "Anarkali Kurti",
        Category: "kurti",
        Price: 2499,
        Tags: ["bestseller", "ready to wear"],
        Quantity: {
          S: 4,
          M: 7,
          L: 9,
          XL: 5,
        },
        Description: {
          Color: "Green",
          Collection: "Ethnic Wear",
          Material: "Rayon",
          Work: "Embroidery",
          Occasion: ["Festival", "Party"],
          Wash_care: "Hand wash cold",
          Length: 1.4,
          Blouse: 0,
          Pattern: "Floral",
        },
      },
      {
        productid: randomUUID(),
        image: "/placeholder.svg?height=600&width=450",
        Name: "Sequined Evening Gown",
        Category: "gowns",
        Price: 5999,
        Tags: ["premium", "ready to wear"],
        Quantity: {
          S: 2,
          M: 4,
          L: 3,
          XL: 2,
        },
        Description: {
          Color: "Black",
          Collection: "Party Wear",
          Material: "Crepe",
          Work: "Sequins",
          Occasion: ["Party", "Evening"],
          Wash_care: "Dry clean only",
          Length: 1.5,
          Blouse: 0,
          Pattern: "Solid",
        },
      },
      {
        productid: randomUUID(),
        image: "/placeholder.svg?height=600&width=450",
        Name: "Embroidered Kurta Palazzo Set",
        Category: "kurta set",
        Price: 4499,
        Tags: ["new arrival", "ready to wear"],
        Quantity: {
          S: 5,
          M: 8,
          L: 6,
          XL: 3,
        },
        Description: {
          Color: "Yellow",
          Collection: "Summer Collection",
          Material: "Cotton",
          Work: "Embroidery",
          Occasion: ["Casual", "Office"],
          Wash_care: "Machine wash cold",
          Length: 1.2,
          Blouse: 0,
          Pattern: "Floral",
        },
      },
      {
        productid: randomUUID(),
        image: "/placeholder.svg?height=600&width=450",
        Name: "Chiffon Designer Saree",
        Category: "saree",
        Price: 3499,
        Tags: ["sale", "ready to wear"],
        Quantity: {
          "Free Size": 12,
        },
        Description: {
          Color: "Purple",
          Collection: "Party Wear",
          Material: "Chiffon",
          Work: "Printed",
          Occasion: ["Party", "Casual"],
          Wash_care: "Dry clean only",
          Length: 5.5,
          Blouse: 0.8,
          Pattern: "Abstract",
        },
      },
      {
        productid: randomUUID(),
        image: "/placeholder.svg?height=600&width=450",
        Name: "Plus Size Embroidered Kurti",
        Category: "plus size kurti",
        Price: 1999,
        Tags: ["inclusive", "ready to wear"],
        Quantity: {
          XL: 8,
          XXL: 10,
          "3XL": 6,
        },
        Description: {
          Color: "Navy Blue",
          Collection: "Casual Wear",
          Material: "Cotton Blend",
          Work: "Embroidery",
          Occasion: ["Daily", "Office"],
          Wash_care: "Machine wash cold",
          Length: 1.3,
          Blouse: 0,
          Pattern: "Solid",
        },
      },
      {
        productid: randomUUID(),
        image: "/placeholder.svg?height=600&width=450",
        Name: "Bridal Lehenga",
        Category: "kurta set",
        Price: 15999,
        Tags: ["premium", "bridal"],
        Quantity: {
          S: 2,
          M: 3,
          L: 2,
          XL: 1,
        },
        Description: {
          Color: "Red",
          Collection: "Bridal Collection",
          Material: "Velvet",
          Work: "Zardozi",
          Occasion: ["Wedding"],
          Wash_care: "Dry clean only",
          Length: 1.5,
          Blouse: 0.8,
          Pattern: "Traditional",
        },
      },
      {
        productid: randomUUID(),
        image: "/placeholder.svg?height=600&width=450",
        Name: "Casual Cotton Kurti",
        Category: "kurti",
        Price: 999,
        Tags: ["sale", "ready to wear"],
        Quantity: {
          S: 10,
          M: 15,
          L: 12,
          XL: 8,
        },
        Description: {
          Color: "White",
          Collection: "Casual Wear",
          Material: "Cotton",
          Work: "Printed",
          Occasion: ["Daily", "Casual"],
          Wash_care: "Machine wash cold",
          Length: 1.1,
          Blouse: 0,
          Pattern: "Floral",
        },
      },
    ]

    // Insert products
    const result = await db.collection("products").insertMany(products)
    console.log(`${result.insertedCount} products inserted successfully`)

    // Create indexes
    await db.collection("products").createIndex({ Category: 1 })
    await db.collection("products").createIndex({ Tags: 1 })
    await db.collection("products").createIndex({ Name: "text" })

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
    console.log("MongoDB connection closed")
  }
}

seedDatabase()

