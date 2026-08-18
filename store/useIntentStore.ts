import { create } from "zustand";
import { Intent, ActivityEvent, RouteOption, TokenInfo, ExecutionType } from "@/types/intent";
import { SUPPORTED_TOKENS } from "@/lib/stellar/config";
import { calculateOptimalRoute } from "@/lib/routing/routingEngine";
import { eventSubscriber } from "@/lib/stellar/events";

interface IntentStoreState {
  intents: Intent[];
  activeIntentId: string | null;
  activityFeed: ActivityEvent[];
  // Draft Form State
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  amountIn: string;
  maxSlippageBps: number; // 50 = 0.5%
  executionType: ExecutionType;
  deadlineMinutes: number;
  calculatedRoute: RouteOption | null;
  isCalculatingRoute: boolean;

  // Actions
  setTokenIn: (token: TokenInfo) => void;
  setTokenOut: (token: TokenInfo) => void;
  setAmountIn: (amount: string) => void;
  setMaxSlippageBps: (slippage: number) => void;
  setExecutionType: (type: ExecutionType) => void;
  setDeadlineMinutes: (minutes: number) => void;
  recalculateRoute: () => void;
  submitIntent: (userAddress: string) => Promise<string>;
  cancelIntent: (intentId: string) => void;
  setActiveIntentId: (id: string | null) => void;
  addActivityEvent: (event: ActivityEvent) => void;
}

const INITIAL_EVENTS: ActivityEvent[] = [
  {
    id: "evt_1",
    type: "IntentSubmitted",
    timestamp: Date.now() - 120000,
    walletAddress: "GBBD47IF6LWK7P7MDEVSCWR7DPCCM3GHXYCCEDA2SRYPXQGB6GXTCCYA",
    action: "Submitted 1000 USDC -> XLM swap intent",
    txHash: "4a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
    intentId: "intent_101",
  },
  {
    id: "evt_2",
    type: "RouteCalculated",
    timestamp: Date.now() - 110000,
    walletAddress: "GBBD47IF6LWK7P7MDEVSCWR7DPCCM3GHXYCCEDA2SRYPXQGB6GXTCCYA",
    action: "Calculated optimal multi-source path (Soroswap 65% + Phoenix 35%)",
    intentId: "intent_101",
  },
  {
    id: "evt_3",
    type: "SwapExecuted",
    timestamp: Date.now() - 95000,
    walletAddress: "GBBD47IF6LWK7P7MDEVSCWR7DPCCM3GHXYCCEDA2SRYPXQGB6GXTCCYA",
    action: "Executed swap: received 8602.00 XLM",
    txHash: "9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
    intentId: "intent_101",
  },
  {
    id: "evt_4",
    type: "TransactionConfirmed",
    timestamp: Date.now() - 90000,
    walletAddress: "GBBD47IF6LWK7P7MDEVSCWR7DPCCM3GHXYCCEDA2SRYPXQGB6GXTCCYA",
    action: "Transaction confirmed on Stellar Testnet ledger #512849",
    txHash: "9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
    intentId: "intent_101",
  },
];

const INITIAL_INTENTS: Intent[] = [
  {
    id: "intent_101",
    userAddress: "GBBD47IF6LWK7P7MDEVSCWR7DPCCM3GHXYCCEDA2SRYPXQGB6GXTCCYA",
    tokenIn: SUPPORTED_TOKENS[1], // USDC
    tokenOut: SUPPORTED_TOKENS[0], // XLM
    amountIn: "1000.00",
    minAmountOut: "8500.00",
    maxSlippageBps: 50,
    deadlineSeconds: 3600,
    executionType: "best_price",
    status: "confirmed",
    createdAt: Date.now() - 120000,
    executedAmountOut: "8602.0000000",
    executionHash: "9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
    calculatedRoute: calculateOptimalRoute({
      tokenIn: SUPPORTED_TOKENS[1],
      tokenOut: SUPPORTED_TOKENS[0],
      amountIn: "1000.00",
      executionType: "best_price",
      maxSlippageBps: 50,
    }),
  },
];

export const useIntentStore = create<IntentStoreState>((set, get) => ({
  intents: INITIAL_INTENTS,
  activeIntentId: "intent_101",
  activityFeed: INITIAL_EVENTS,

  tokenIn: SUPPORTED_TOKENS[1], // USDC
  tokenOut: SUPPORTED_TOKENS[0], // XLM
  amountIn: "100",
  maxSlippageBps: 50, // 0.5%
  executionType: "best_price",
  deadlineMinutes: 30,
  calculatedRoute: calculateOptimalRoute({
    tokenIn: SUPPORTED_TOKENS[1],
    tokenOut: SUPPORTED_TOKENS[0],
    amountIn: "100",
    executionType: "best_price",
    maxSlippageBps: 50,
  }),
  isCalculatingRoute: false,

  setTokenIn: (token) => {
    set({ tokenIn: token });
    get().recalculateRoute();
  },

  setTokenOut: (token) => {
    set({ tokenOut: token });
    get().recalculateRoute();
  },

  setAmountIn: (amount) => {
    set({ amountIn: amount });
    get().recalculateRoute();
  },

  setMaxSlippageBps: (slippage) => {
    set({ maxSlippageBps: slippage });
    get().recalculateRoute();
  },

  setExecutionType: (type) => {
    set({ executionType: type });
    get().recalculateRoute();
  },

  setDeadlineMinutes: (minutes) => {
    set({ deadlineMinutes: minutes });
  },

  recalculateRoute: () => {
    const { tokenIn, tokenOut, amountIn, executionType, maxSlippageBps } = get();
    if (!amountIn || parseFloat(amountIn) <= 0) {
      set({ calculatedRoute: null });
      return;
    }
    set({ isCalculatingRoute: true });
    setTimeout(() => {
      const route = calculateOptimalRoute({
        tokenIn,
        tokenOut,
        amountIn,
        executionType,
        maxSlippageBps,
      });
      set({ calculatedRoute: route, isCalculatingRoute: false });
    }, 200);
  },

  setActiveIntentId: (id) => set({ activeIntentId: id }),

  addActivityEvent: (evt) => {
    set((state) => ({ activityFeed: [evt, ...state.activityFeed] }));
  },

  submitIntent: async (userAddress: string) => {
    const { tokenIn, tokenOut, amountIn, maxSlippageBps, executionType, deadlineMinutes, calculatedRoute } = get();
    const intentId = `intent_${Date.now().toString().slice(-6)}`;
    const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    const newIntent: Intent = {
      id: intentId,
      userAddress,
      tokenIn,
      tokenOut,
      amountIn,
      minAmountOut: calculatedRoute ? (parseFloat(calculatedRoute.estimatedOutput) * 0.995).toFixed(6) : "0",
      maxSlippageBps,
      deadlineSeconds: deadlineMinutes * 60,
      executionType,
      status: "pending",
      createdAt: Date.now(),
      calculatedRoute: calculatedRoute || undefined,
    };

    set((state) => ({
      intents: [newIntent, ...state.intents],
      activeIntentId: intentId,
    }));

    // Emit Submission Event
    const submitEvt: ActivityEvent = {
      id: `evt_${Date.now()}_1`,
      type: "IntentSubmitted",
      timestamp: Date.now(),
      walletAddress: userAddress,
      action: `Submitted ${amountIn} ${tokenIn.code} -> ${tokenOut.code} intent`,
      intentId,
    };
    get().addActivityEvent(submitEvt);

    // Simulate Async Execution Lifecycle
    setTimeout(() => {
      // Step 1: Route Calculated
      set((state) => ({
        intents: state.intents.map((i) => (i.id === intentId ? { ...i, status: "executing" } : i)),
      }));
      const calcEvt: ActivityEvent = {
        id: `evt_${Date.now()}_2`,
        type: "RouteCalculated",
        timestamp: Date.now(),
        walletAddress: userAddress,
        action: `Calculated path via ${calculatedRoute?.dexSources.join(" + ") || "Soroswap"}`,
        intentId,
      };
      get().addActivityEvent(calcEvt);

      setTimeout(() => {
        // Step 2: Swap Executed & Confirmed
        const executedOut = calculatedRoute ? calculatedRoute.estimatedOutput : (parseFloat(amountIn) * 8.5).toFixed(6);
        set((state) => ({
          intents: state.intents.map((i) =>
            i.id === intentId
              ? {
                  ...i,
                  status: "confirmed",
                  executedAmountOut: executedOut,
                  executionHash: txHash,
                }
              : i
          ),
        }));

        const swapEvt: ActivityEvent = {
          id: `evt_${Date.now()}_3`,
          type: "SwapExecuted",
          timestamp: Date.now(),
          walletAddress: userAddress,
          action: `Executed swap: received ${executedOut} ${tokenOut.code}`,
          txHash,
          intentId,
        };
        get().addActivityEvent(swapEvt);

        const confirmEvt: ActivityEvent = {
          id: `evt_${Date.now()}_4`,
          type: "TransactionConfirmed",
          timestamp: Date.now(),
          walletAddress: userAddress,
          action: `Transaction confirmed on Stellar Testnet ledger #${Math.floor(512900 + Math.random() * 1000)}`,
          txHash,
          intentId,
        };
        get().addActivityEvent(confirmEvt);
      }, 2000);
    }, 1500);

    return intentId;
  },

  cancelIntent: (intentId: string) => {
    set((state) => ({
      intents: state.intents.map((i) => (i.id === intentId ? { ...i, status: "cancelled" } : i)),
    }));
    const evt: ActivityEvent = {
      id: `evt_${Date.now()}`,
      type: "IntentCancelled",
      timestamp: Date.now(),
      walletAddress: get().intents.find((i) => i.id === intentId)?.userAddress || "unknown",
      action: `Cancelled intent ${intentId}`,
      intentId,
    };
    get().addActivityEvent(evt);
  },
}));
