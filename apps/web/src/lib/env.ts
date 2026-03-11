const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const DEFAULT_OPENAI_MODEL = "gpt-5-mini";
const DEFAULT_OPENAI_TIMEOUT_MS = 20_000;

function readValue(value: string | undefined) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
}

function readNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getAppConfig() {
  return {
    appUrl: readValue(process.env.APP_URL) ?? "http://localhost:3000",
    databaseUrl: readValue(process.env.DATABASE_URL),
    openAiApiKey: readValue(process.env.OPENAI_API_KEY),
    openAiModel: readValue(process.env.OPENAI_MODEL) ?? DEFAULT_OPENAI_MODEL,
    openAiTimeoutMs: readNumber(process.env.OPENAI_TIMEOUT_MS, DEFAULT_OPENAI_TIMEOUT_MS),
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

export function hasOpenAIConfig() {
  return Boolean(getAppConfig().openAiApiKey);
}

export function getInquiryResponseMode() {
  return hasOpenAIConfig() ? "openai" : "rules";
}

export function getOpenAIConfig() {
  const config = getAppConfig();

  if (!config.openAiApiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  return {
    apiKey: config.openAiApiKey,
    model: config.openAiModel,
    timeoutMs: config.openAiTimeoutMs,
  };
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
