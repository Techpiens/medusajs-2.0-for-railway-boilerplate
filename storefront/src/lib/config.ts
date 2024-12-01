import Medusa from "@medusajs/js-sdk"

console.log("reading process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY", process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY)
export const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9002",
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
