let cachedVisitorId: string | undefined;
let inFlight: Promise<string | undefined> | null = null;

/**
 * Silently derives a device fingerprint for fraud/abuse signals on auth
 * requests. Dynamically imported so the fingerprinting library (which
 * touches browser-only APIs) never loads during Next.js SSR. Failures are
 * swallowed since auth must work even when fingerprinting doesn't.
 */
export async function getDeviceFingerprint(): Promise<string | undefined> {
  if (cachedVisitorId !== undefined) {
    return cachedVisitorId;
  }

  if (!inFlight) {
    inFlight = (async () => {
      try {
        const FingerprintJS = await import("@fingerprintjs/fingerprintjs");
        const agent = await FingerprintJS.load();
        const result = await agent.get();
        cachedVisitorId = result.visitorId;
        return cachedVisitorId;
      } catch {
        return undefined;
      } finally {
        inFlight = null;
      }
    })();
  }

  return inFlight;
}
