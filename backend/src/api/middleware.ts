import {MedusaError} from "@medusajs/utils";
import {defineMiddlewares, MedusaNextFunction, MedusaRequest, MedusaResponse} from "@medusajs/framework";

export default defineMiddlewares({
  errorHandler: (
    error: MedusaError | any,
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    res.status(400).json({
      error: "Something bad happened.",
    })
  },
})
