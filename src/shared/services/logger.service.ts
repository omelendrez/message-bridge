export class Logger {
  static error(message: string, error: Error, context?: object) {
    console.error({
      message,
      error: error.message,
      stack: error.stack,
      ...context,
      timestamp: new Date().toISOString()
    })
  }
}
