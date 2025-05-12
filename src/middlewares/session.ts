export interface SessionData {
  lastProcessedStoryIds?: unknown;
}

export function initialSession(): SessionData {
  return {};
}
