import type {MedusaRequest, MedusaResponse} from "@medusajs/framework";
import StorefrontNotifierService from "modules/revalidation/storefront-notifier";

type Props = {
  tag: string;
}

export const POST = async (
  // req: AuthenticatedMedusaRequest<AdminGetQuoteParamsType>,
  req: MedusaRequest<Props>,
  res: MedusaResponse
) => {
  console.log("TESTX - Revalidate route body", JSON.stringify(req.body));
  console.log("TESTX - Revalidate route params", JSON.stringify(req.params));
  // req.par
  const { tag } = req.body;
  console.log("TESTX - Revalidate route tag", tag);

  const storefrontNotifier: StorefrontNotifierService = req.scope.resolve("STOREFRONT_NOTIFIER_MODULE");
  await storefrontNotifier.revalidateData(tag);

  res.json({message: `Revalidated tag: ${tag}`});
};
