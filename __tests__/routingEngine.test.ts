import { describe, it, expect } from "vitest";
import { calculateOptimalRoute } from "../lib/routing/routingEngine";
import { SUPPORTED_TOKENS } from "../lib/stellar/config";

describe("Routing Engine - calculateOptimalRoute", () => {
  const tokenIn = SUPPORTED_TOKENS[1]; // USDC
  const tokenOut = SUPPORTED_TOKENS[0]; // XLM

  it("calculates optimal route for best_price with split DEX sources", () => {
    const route = calculateOptimalRoute({
      tokenIn,
      tokenOut,
      amountIn: "1000",
      executionType: "best_price",
      maxSlippageBps: 50,
    });

    expect(route).toBeDefined();
    expect(route.name).toBe("BEST PRICE");
    expect(route.dexSources).toEqual(["Soroswap", "Phoenix AMM"]);
    expect(route.steps.length).toBe(2);
    expect(parseFloat(route.estimatedOutput)).toBeGreaterThan(8000);
  });

  it("calculates low fee route prioritizing single low-fee pool", () => {
    const route = calculateOptimalRoute({
      tokenIn,
      tokenOut,
      amountIn: "500",
      executionType: "low_fee",
      maxSlippageBps: 30,
    });

    expect(route.name).toBe("LOW FEE");
    expect(route.dexSources).toEqual(["Stellar SDEX"]);
    expect(route.protocolFee).toContain("USDC");
  });

  it("calculates MEV protected route with delay buffer", () => {
    const route = calculateOptimalRoute({
      tokenIn,
      tokenOut,
      amountIn: "2500",
      executionType: "mev_protected",
      maxSlippageBps: 50,
    });

    expect(route.name).toBe("MEV PROTECTED");
    expect(route.mevProtected).toBe(true);
    expect(route.executionTimeMs).toBeGreaterThanOrEqual(2500);
  });

  it("calculates multi-hop route via intermediate XLM bridge", () => {
    const route = calculateOptimalRoute({
      tokenIn,
      tokenOut: SUPPORTED_TOKENS[2], // AQUA
      amountIn: "100",
      executionType: "multi_hop",
      maxSlippageBps: 100,
    });

    expect(route.name).toBe("MULTI HOP");
    expect(route.steps.length).toBe(2);
    expect(route.path).toEqual(["USDC", "XLM", "AQUA"]);
  });
});
