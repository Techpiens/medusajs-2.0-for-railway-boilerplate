import {SubscriberArgs, SubscriberConfig} from '@medusajs/medusa'
import {STORE_CORS} from "lib/constants";

export default async function regionUpdateHandler(
  {event: {data}, container}: SubscriberArgs<{ id: string }>,
) {
  const requestUrl = `${STORE_CORS}/api/revalidate`
  console.log("TESTX - Sending region updated notification to", requestUrl)
  const result = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.STORE_API_KEY || '',
    },
    body: JSON.stringify({productId: data.id, tag: "regions"}),
  });
}

export const config: SubscriberConfig = {
  event: ["region.created", "region.updated", "region.deleted"],
  context: {
    subscriberId: "regionUpdateHandler",
  },
} satisfies SubscriberConfig
