import * as winston from "winston";

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

export function logRequest(req: Request, body: any) {
  logger.info("request", {
    url: req.url,
    headers: Object.fromEntries(req.headers),
    body,
  });
}

export function logUserAction(userId: string, email: string, action: string, params: any) {
  logger.info("user_action", { userId, email, action, params });
}

export function logError(err: Error, context: any) {
  logger.error(err.message, { stack: err.stack, ...context });
}

export function trackEvent(eventName: string, props: Record<string, any>) {
  logger.info(eventName + " " + JSON.stringify(props));
}
