import { Metadata } from "next"
import { notFound } from "next/navigation"

import ProductTemplate from "@modules/products/templates"
import { getRegionUnstableCache, listRegionsUnstableCache } from "../../../../../backend/rAPI/regions-RAPI"
import {
  getProductByHandleUnstableCache,
  getProductsListUnstableCache,
} from "../../../../../backend/rAPI/products-RAPI"

type Props = {
  params: {
    countryCode: string
    handle: string
  }
}

export async function generateStaticParams() {
  console.log("TESTX - generateStaticParams")
  const countryCodes = await listRegionsUnstableCache().then(
    (regions) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )

  if (!countryCodes) {
    return null
  }

  const products = await Promise.all(
    countryCodes.map((countryCode) => {
      return getProductsListUnstableCache({ countryCode })
    })
  ).then((responses) => responses.map(({ products }) => products).flat())

  const staticParams = countryCodes
    ?.map((countryCode) =>
      products.map((product) => ({
        countryCode,
        handle: product.handle,
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  console.log("TESTX - generateMetadata")
  const { handle } = params
  const region = await getRegionUnstableCache(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await getProductByHandleUnstableCache(handle, region.id)

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const region = await getRegionUnstableCache(params.countryCode)

  if (!region) {
    notFound()
  }

  const pricedProduct = await getProductByHandleUnstableCache(params.handle, region.id)
  if (!pricedProduct) {
    notFound()
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
    />
  )
}
