import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { StoreRegion } from "@medusajs/types"
import { unstable_cache } from "next/cache"
import { CacheTags } from "../cache-tags"
import { logger } from "@lib/logger/pino-logger"

export const listRegionsUnstableCache = unstable_cache(
  async function () {
    logger.trace({
      tag: CacheTags.REGIONS,
      function: "listRegionsUnstableCache",
    })
    return sdk.store.region
      .list({}, { next: { tags: [CacheTags.REGIONS] } })
      .then(({ regions }) => regions)
      .catch(medusaError)
  },
  [CacheTags.REGIONS],
  { revalidate: false }
)

export const retrieveRegionUnstableCache = unstable_cache(
  async function (id: string) {
    logger.trace({
      tag: CacheTags.REGIONS,
      function: "retrieveRegionUnstableCache",
    })
    return sdk.store.region
      .retrieve(id, {}, { next: { tags: ["regions"] } })
      .then(({ region }) => region)
      .catch(medusaError)
  },
  [CacheTags.REGIONS],
  { revalidate: false }
)

export const getRegionUnstableCache = unstable_cache(
  async function (countryCode: string) {
    logger.trace({
      tag: CacheTags.REGIONS,
      function: "getRegionUnstableCache",
    })
    try {
      const regionMap = new Map<string, StoreRegion>()
      const regions = await listRegionsUnstableCache()

      if (!regions) {
        return null
      }

      regions.forEach((region) => {
        region.countries?.forEach((c) => {
          regionMap.set(c?.iso_2 ?? "", region)
        })
      })

      return countryCode ? regionMap.get(countryCode) : regionMap.get("us")
    } catch (e: any) {
      return null
    }
  },
  [CacheTags.REGIONS],
  { revalidate: false }
)
