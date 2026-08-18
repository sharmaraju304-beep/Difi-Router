import { TokenInfo, RouteOption, ExecutionType, HopStep } from "@/types/intent";

export interface CalculateRouteParams {
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  amountIn: string;
  executionType: ExecutionType;
  maxSlippageBps: number;
}

export function calculateOptimalRoute(params: CalculateRouteParams): RouteOption {
  const amount = parseFloat(params.amountIn) || 0;

  // Base mock conversion rates on Stellar Testnet
  const rateMap: Record<string, Record<string, number>> = {
    USDC: { XLM: 8.5, AQUA: 120.0, USDT: 1.0 },
    XLM: { USDC: 0.1176, AQUA: 14.11, USDT: 0.1176 },
    AQUA: { USDC: 0.00833, XLM: 0.0708, USDT: 0.00833 },
    USDT: { USDC: 1.0, XLM: 8.5, AQUA: 120.0 },
  };

  const directRate = rateMap[params.tokenIn.code]?.[params.tokenOut.code] || 1.0;
  const rawOutput = amount * directRate;

  // Routing strategies based on executionType
  let dexSources: string[] = [];
  let steps: HopStep[] = [];
  let feeBps = 15; // 0.15% default fee
  let mevProtected = false;
  let executionTimeMs = 1200;
  let splitPercent = 100;
  let finalRate = directRate;

  if (params.executionType === "best_price") {
    dexSources = ["Soroswap", "Phoenix AMM"];
    finalRate = directRate * 1.012; // 1.2% optimization via split
    steps = [
      {
        dex: "Soroswap",
        fromToken: params.tokenIn.code,
        toToken: params.tokenOut.code,
        poolFee: "0.15%",
        splitPercent: 65,
      },
      {
        dex: "Phoenix",
        fromToken: params.tokenIn.code,
        toToken: params.tokenOut.code,
        poolFee: "0.20%",
        splitPercent: 35,
      },
    ];
  } else if (params.executionType === "low_fee") {
    dexSources = ["Stellar SDEX"];
    feeBps = 5; // 0.05%
    finalRate = directRate * 1.002;
    steps = [
      {
        dex: "Stellar SDEX",
        fromToken: params.tokenIn.code,
        toToken: params.tokenOut.code,
        poolFee: "0.05%",
        splitPercent: 100,
      },
    ];
  } else if (params.executionType === "mev_protected") {
    dexSources = ["Batch Router (Soroban)"];
    mevProtected = true;
    executionTimeMs = 2500; // Batch delay protection
    finalRate = directRate * 1.005;
    steps = [
      {
        dex: "Batch Router",
        fromToken: params.tokenIn.code,
        toToken: params.tokenOut.code,
        poolFee: "0.10%",
        splitPercent: 100,
      },
    ];
  } else if (params.executionType === "multi_hop") {
    dexSources = ["Soroswap", "Stellar SDEX"];
    finalRate = directRate * 1.025; // 2.5% improvement via intermediate XLM hop
    steps = [
      {
        dex: "Soroswap",
        fromToken: params.tokenIn.code,
        toToken: "XLM",
        poolFee: "0.15%",
        splitPercent: 100,
      },
      {
        dex: "Stellar SDEX",
        fromToken: "XLM",
        toToken: params.tokenOut.code,
        poolFee: "0.05%",
        splitPercent: 100,
      },
    ];
  }

  const estimatedOutVal = amount * finalRate;
  const priceImpactVal = amount > 10000 ? "0.42%" : amount > 1000 ? "0.12%" : "0.03%";
  const protocolFeeVal = ((amount * feeBps) / 10000).toFixed(6) + " " + params.tokenIn.code;

  return {
    id: `route_${Date.now()}`,
    name: params.executionType.replace("_", " ").toUpperCase(),
    dexSources,
    estimatedOutput: estimatedOutVal.toFixed(6),
    priceImpact: priceImpactVal,
    protocolFee: protocolFeeVal,
    networkFee: "0.0000100 XLM",
    executionTimeMs,
    mevProtected,
    steps,
    path: [params.tokenIn.code, ...steps.map((s) => s.toToken)],
  };
}
