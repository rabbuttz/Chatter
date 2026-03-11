const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function readValue(value: string | undefined) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
}

export function getAppConfig() {
  return {
    appUrl: readValue(process.env.APP_URL) ?? "http://localhost:3000",
    databaseUrl: readValue(process.env.DATABASE_URL),
    sessionSecret: readValue(process.env.SESSION_SECRET),
    sessionMaxAgeSeconds: SESSION_MAX_AGE_SECONDS,
  };
}

export function hasProductionConfig() {
  const config = getAppConfig();

  return Boolean(config.databaseUrl && config.sessionSecret);
}

export function isDemoFallbackEnabled() {
  return !hasProductionConfig() && process.env.NODE_ENV !== "production";
}

export function isProductionPersistenceEnabled() {
  return hasProductionConfig();
}

export function getRequiredProductionEnv() {
  const config = getAppConfig();

  if (!config.databaseUrl || !config.sessionSecret) {
    throw new Error(
      "DATABASE_URL and SESSION_SECRET are required for production persistence.",
    );
  }

  if (config.sessionSecret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters.");
  }

  return config;
}
