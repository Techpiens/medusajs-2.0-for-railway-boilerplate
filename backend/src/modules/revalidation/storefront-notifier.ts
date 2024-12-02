import { Logger } from '@medusajs/types'
import { MedusaError } from '@medusajs/utils'

type InjectedDependencies = {
  logger: Logger
}

interface StorefrontNotifierServiceConfig {
  store_api_key: string
  store_cors: string
}

type StorefrontNotifierServiceOptions = {
  store_api_key: string
  store_cors: string
}

/**
 * Service to notify storefront of admin updates.
 */
export default class StorefrontNotifierService {
  static identifier = "STOREFRONT_NOTIFIER_MODULE"
  protected config_: StorefrontNotifierServiceConfig
  protected logger_: Logger

  constructor({ }: InjectedDependencies, options: StorefrontNotifierServiceOptions) {
    this.config_ = {
      store_api_key: options.store_api_key,
      store_cors: options.store_cors,
    }
    // this.logger_ = logger
  }

  async revalidateData(tag: string): Promise<void> {
    console.log("TESTX - Sending product updated notification to", tag)
    /// this.logger_.info(`Sending product updated notification to ${tag}`)

    try {

      const requestUrl = `${this.config_.store_cors}/api/revalidate`
      console.log("TESTX - Sending product updated notification to", requestUrl)
      const result = await fetch(requestUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'x-api-key': this.config_.store_api_key},
        body: JSON.stringify({tag: "products"}),
      });


      if (!result.ok) {
        // Handle HTTP errors (non-2xx responses)
        const errorData = await result.json().catch(() => null);
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `Request failed: ${result.status} ${errorData?.message || result.statusText}`,
        );
      }

      // Parse successful response
      // const data = await result.json();
      // return data;
    } catch (error) {
      if (error instanceof MedusaError) {
        throw error // Re-throw MedusaError for invalid template data
      }
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Error notifying storefront: ${error.message}`
      )
    }
  }
}
