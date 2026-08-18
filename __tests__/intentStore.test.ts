import { describe, it, expect, beforeEach } from "vitest";
import { useIntentStore } from "../store/useIntentStore";
import { SUPPORTED_TOKENS } from "../lib/stellar/config";

describe("Intent Store State Management", () => {
  beforeEach(() => {
    // Reset store state
    const store = useIntentStore.getState();
    store.setAmountIn("100");
    store.setTokenIn(SUPPORTED_TOKENS[1]); // USDC
    store.setTokenOut(SUPPORTED_TOKENS[0]); // XLM
  });

  it("updates draft form state and recalculates route", () => {
    const store = useIntentStore.getState();
    expect(store.amountIn).toBe("100");
    expect(store.calculatedRoute).not.toBeNull();

    store.setAmountIn("500");
    expect(useIntentStore.getState().amountIn).toBe("500");
  });

  it("allows submitting a new intent and prepends to activity feed", async () => {
    const store = useIntentStore.getState();
    const initialIntentsCount = store.intents.length;
    const initialEventsCount = store.activityFeed.length;

    const userAddress = "GBBD47IF6LWK7P7MDEVSCWR7DPCCM3GHXYCCEDA2SRYPXQGB6GXTCCYA";
    const intentId = await store.submitIntent(userAddress);

    const updatedStore = useIntentStore.getState();
    expect(intentId).toContain("intent_");
    expect(updatedStore.intents.length).toBe(initialIntentsCount + 1);
    expect(updatedStore.activityFeed.length).toBeGreaterThan(initialEventsCount);
    expect(updatedStore.intents[0].userAddress).toBe(userAddress);
  });
});
