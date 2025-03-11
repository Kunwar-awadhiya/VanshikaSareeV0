export interface Product {
  productid: string
  image: string
  Name: string
  Category: "saree" | "kurti" | "plus size kurti" | "gowns" | "kurta set"
  Price: number
  Tags: string[]
  Quantity: {
    [size: string]: number
  }
  Description: {
    Color: string
    Collection: string
    Material: string
    Work: string
    Occasion: string[]
    Wash_care: string
    Length: number
    Blouse: number
    Pattern: string
  }
}

