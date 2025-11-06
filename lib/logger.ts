/**
 * Safe logging utility that only logs in development
 * Works in both server and client environments
 */
const isDevelopment =
  typeof process !== 'undefined'
    ? process.env.NODE_ENV === 'development'
    : process.env.NEXT_PUBLIC_NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_NODE_ENV

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(...args)
    }
  },
  error: (...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.error(...args)
    }
    // In production, consider sending to error tracking service (e.g., Sentry)
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.warn(...args)
    }
  },
}

