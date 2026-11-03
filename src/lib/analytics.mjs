/**
 * @param {{environment?: string, enabled?: string, measurementId?: string}} options
 * @returns {string | null}
 */
export function resolveAnalytics({ environment, enabled, measurementId } = {}) {
  if (environment !== "production" || enabled !== "true") return null;
  const id = measurementId?.trim();
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) {
    throw new Error("GA4: production analytics requires a valid G- measurement ID");
  }
  return id;
}
