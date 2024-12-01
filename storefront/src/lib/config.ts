import Medusa from "@medusajs/js-sdk"

export type Logger = {
  error: (...messages: string[]) => void;
  warn: (...messages: string[]) => void;
  info: (...messages: string[]) => void;
  debug: (...messages: string[]) => void;
};

const logMedusa = false
const logger: Logger = {
  error: (...messages) => {
    if (logMedusa) console.error(...messages)
  },
  warn: (...messages) => {
    if (logMedusa) console.warn(...messages)
  },
  info: (...messages) => {
    if (logMedusa) console.info(...messages)
  },
  debug: (...messages) => {
    if (logMedusa) console.debug(...messages)
  }
}

console.log("reading process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY", process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY)
export const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9002",
  debug: process.env.NODE_ENV === "development",
  logger: logger,
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
