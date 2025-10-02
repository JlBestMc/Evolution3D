import "@testing-library/jest-dom/vitest";

// Ensure fetch exists; individual tests can stub it
if (!("fetch" in globalThis)) {
  (globalThis as unknown as { fetch: unknown }).fetch = async () => {
    throw new Error("global.fetch not mocked in this test");
  };
}

// Silence noisy console errors from expected missing env warnings
const originalError = console.error;
console.error = (...args: unknown[]) => {
  const [msg] = args as [unknown, ...unknown[]];
  if (
    typeof msg === "string" &&
    (msg.includes("VITE_SUPABASE_URL is missing") ||
      msg.includes("VITE_SUPABASE_ANON_KEY is missing"))
  ) {
    return;
  }
  originalError(...(args as []));
};
