import pino, { Logger } from "pino"

function createLogger(name?: string): Logger {
  return pino({
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "UTC:yyyy-mm-dd HH:MM:ss.l",
      },
    },
    level: process.env.LOG_LEVEL || "trace",
    name: name,
  })
}

// Create default instance
export const logger: Logger = createLogger("PINO_LOGGER")

// You can also create specific loggers
// export const orderLogger = createLogger("orders")
// export const paymentLogger = createLogger("payments")

// Export factory if needed elsewhere
export { createLogger }
