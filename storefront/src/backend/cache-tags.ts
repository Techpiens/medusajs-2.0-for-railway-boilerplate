export const CacheTags = {
  PRODUCTS: "products",
  REGIONS: "regions",
} as const
export type CacheTags = typeof CacheTags[keyof typeof CacheTags]
