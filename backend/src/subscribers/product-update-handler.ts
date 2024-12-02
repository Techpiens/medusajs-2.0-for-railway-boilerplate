import {Modules} from '@medusajs/utils'
import {IProductModuleService} from '@medusajs/types'
import {SubscriberArgs, SubscriberConfig} from '@medusajs/medusa'
import {STORE_CORS} from "lib/constants";

export default async function productUpdateHandler(
  {event: {data}, container}: SubscriberArgs<{ id: string }>,
) {
  // const productModuleService: IProductModuleService = container.resolve(Modules.PRODUCT)

  const requestUrl = `${STORE_CORS}/api/revalidate`
  console.log("TESTX - Sending product updated notification to", requestUrl)
  const result = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.STORE_API_KEY || '',
    },
    body: JSON.stringify({productId: data.id, tag: "products", path: "/[countryCode]"}), //"/[countryCode]/(main)/store"
  });

  // TODO error handling
  // console.log("TESTX - Product updated response", result)

 /* try {
    const product: ProductDTO = await productModuleService.retrieveProduct(data.id)
    console.log("TESTX - Product updated", product)
  } catch (error) {
    console.error('TESTX - Error sending product updated notification:', error)
  }*/
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated", "product.deleted"],
  context: {
    subscriberId: "productUpdatedHandler",
  },
} satisfies SubscriberConfig
