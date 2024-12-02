import "server-only"
import { FindParams, HttpTypes, StoreProductParams } from "@medusajs/types"
import { getRegion } from "@lib/data/regions"
import { revalidateTag, unstable_cache } from "next/cache"
import { sdk } from "@lib/config"

type QueryParams = FindParams & StoreProductParams

type GetProductsListParams = {
  pageParam?: number
  queryParams?: QueryParams
  countryCode: string
}

type ProductsListsResponse = {
  products: HttpTypes.StoreProduct[]
  count: number
  nextPage: number | null
  queryParams?: QueryParams
}

const DEFAULT_LIMIT: number = 12 as const

export const getProductsListUnstableCache = unstable_cache(
  async function ({
    pageParam = 1,
    queryParams,
    countryCode,
  }: GetProductsListParams): Promise<ProductsListsResponse> {
    console.log("TESTX - getProductsListUnstableCache")
    const limit = queryParams?.limit || DEFAULT_LIMIT
    const validPageParam = Math.max(pageParam, 1)
    const offset = (validPageParam - 1) * limit
    const region = await getRegion(countryCode)

    if (!region) {
      return {
        products: [],
        count: 0,
        nextPage: null,
      }
    }

    // revalidateTag("products")
    const { products, count } = await sdk.store.product.list(
      {
        limit: limit,
        offset: offset,
        region_id: region.id,
        fields: "*variants.calculated_price",
        ...queryParams,
      },
      { next: { tags: ["products"] } }
    )

    const nextPage = count > offset + limit ? pageParam + 1 : null
    return {
      products: products,
      count: count,
      nextPage: nextPage,
      queryParams: queryParams,
    }
  },
  ["products"],
  { revalidate: 120 },
)
