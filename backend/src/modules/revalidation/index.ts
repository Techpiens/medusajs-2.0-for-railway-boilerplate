import {Module} from "@medusajs/utils";
import StorefrontNotifierService from "modules/revalidation/storefront-notifier";

export const STOREFRONT_NOTIFIER_MODULE = "STOREFRONT_NOTIFIER_MODULE"

export default Module(STOREFRONT_NOTIFIER_MODULE, {
  service: StorefrontNotifierService,
})
