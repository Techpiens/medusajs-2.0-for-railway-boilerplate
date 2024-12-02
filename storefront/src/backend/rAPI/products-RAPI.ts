import "server-only"
import { FindParams, StoreProduct, StoreProductParams } from "@medusajs/types"
import { unstable_cache } from "next/cache"
import { sdk } from "@lib/config"
import { logger } from "@lib/logger/pino-logger"
import { CacheTags } from "../cache-tags"
import { getRegionUnstableCache } from "./regions-RAPI"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { sortProducts } from "@lib/util/sort-products"
import { cache } from "react"

type QueryParams = FindParams & StoreProductParams

type GetProductsListParams = {
  pageParam?: number
  queryParams?: QueryParams
  countryCode: string
}

type ProductsListsResponse = {
  products: StoreProduct[]
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
    logger.trace({
      tag: CacheTags.PRODUCTS,
      function: "getProductsListUnstableCache",
    })
    const limit = queryParams?.limit || DEFAULT_LIMIT
    const validPageParam = Math.max(pageParam, 1)
    const offset = (validPageParam - 1) * limit
    const region = await getRegionUnstableCache(countryCode)

    if (!region) {
      return {
        products: [],
        count: 0,
        nextPage: null,
      }
    }

    const { products, count } = await sdk.store.product.list(
      {
        limit: limit,
        offset: offset,
        region_id: region.id,
        fields: "*variants.calculated_price",
        ...queryParams,
      },
      { next: { tags: [CacheTags.PRODUCTS] } }
    )

    const nextPage = count > offset + limit ? pageParam + 1 : null
    return {
      products: products,
      count: count,
      nextPage: nextPage,
      queryParams: queryParams,
    }
  },
  [CacheTags.PRODUCTS],
  { revalidate: false }
)

type GetProductsListParamsWithSort = {
  sortBy?: SortOptions | undefined
} & GetProductsListParams

export const getProductsListWithSortUnstableCache = unstable_cache(
  async function ({
    pageParam: page = 0,
    queryParams,
    sortBy = "created_at",
    countryCode,
  }: GetProductsListParamsWithSort): Promise<ProductsListsResponse> {
    logger.trace({
      tag: CacheTags.PRODUCTS,
      function: "getProductsListWithSortUnstableCache",
    })
    const limit = queryParams?.limit || 12

    const { products, count } = await getProductsListUnstableCache({
      pageParam: 0,
      queryParams: { ...queryParams, limit: 100 },
      countryCode: countryCode,
    })

    const sortedProducts = sortProducts(products, sortBy)
    const pageParam = (page - 1) * limit
    const nextPage = count > pageParam + limit ? pageParam + limit : null
    const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

    return {
      products: paginatedProducts,
      count: count,
      nextPage: nextPage,
      queryParams: queryParams,
    }
  },
  [CacheTags.PRODUCTS],
  { revalidate: false }
)

export const getProductByHandleUnstableCache = unstable_cache(
  async function (handle: string, regionId: string) {
    logger.trace({
      tag: CacheTags.PRODUCTS,
      function: "getProductByHandleUnstableCache",
    })
    return sdk.store.product
      .list(
        {
          handle: handle,
          region_id: regionId,
          fields: "*variants.calculated_price,+variants.inventory_quantity",
        },
        { next: { tags: [CacheTags.PRODUCTS] } }
      )
      .then(({ products }) => products[0])
  },
  [CacheTags.PRODUCTS],
  { revalidate: false }
)
