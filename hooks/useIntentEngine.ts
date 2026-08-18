import { useIntentStore } from "@/store/useIntentStore";
import { useWalletStore } from "@/store/useWalletStore";

export function useIntentEngine() {
  const tokenIn = useIntentStore((s) => s.tokenIn);
  const tokenOut = useIntentStore((s) => s.tokenOut);
  const amountIn = useIntentStore((s) => s.amountIn);
  const maxSlippageBps = useIntentStore((s) => s.maxSlippageBps);
  const executionType = useIntentStore((s) => s.executionType);
  const deadlineMinutes = useIntentStore((s) => s.deadlineMinutes);
  const calculatedRoute = useIntentStore((s) => s.calculatedRoute);
  const isCalculatingRoute = useIntentStore((s) => s.isCalculatingRoute);
  const intents = useIntentStore((s) => s.intents);
  const activeIntentId = useIntentStore((s) => s.activeIntentId);

  const setTokenIn = useIntentStore((s) => s.setTokenIn);
  const setTokenOut = useIntentStore((s) => s.setTokenOut);
  const setAmountIn = useIntentStore((s) => s.setAmountIn);
  const setMaxSlippageBps = useIntentStore((s) => s.setMaxSlippageBps);
  const setExecutionType = useIntentStore((s) => s.setExecutionType);
  const setDeadlineMinutes = useIntentStore((s) => s.setDeadlineMinutes);
  const submitIntent = useIntentStore((s) => s.submitIntent);
  const cancelIntent = useIntentStore((s) => s.cancelIntent);
  const setActiveIntentId = useIntentStore((s) => s.setActiveIntentId);

  const walletAddress = useWalletStore((s) => s.address);

  const activeIntent = intents.find((i) => i.id === activeIntentId) || intents[0] || null;

  const handleSubmit = async () => {
    if (!walletAddress) {
      throw new Error("Wallet not connected.");
    }
    return await submitIntent(walletAddress);
  };

  return {
    tokenIn,
    tokenOut,
    amountIn,
    maxSlippageBps,
    executionType,
    deadlineMinutes,
    calculatedRoute,
    isCalculatingRoute,
    intents,
    activeIntent,
    activeIntentId,
    setTokenIn,
    setTokenOut,
    setAmountIn,
    setMaxSlippageBps,
    setExecutionType,
    setDeadlineMinutes,
    handleSubmit,
    cancelIntent,
    setActiveIntentId,
  };
}
