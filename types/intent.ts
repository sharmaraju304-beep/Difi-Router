export type ExecutionType = 'best_price' | 'low_fee' | 'mev_protected' | 'multi_hop';

export type IntentStatus = 'pending' | 'executing' | 'confirmed' | 'failed' | 'cancelled';

export interface TokenInfo {
  symbol: string;
  name: string;
  code: string;
  issuer?: string;
  contractId: string;
  decimals: number;
  icon: string;
  balance?: string;
}

export interface HopStep {
  dex: 'Soroswap' | 'Phoenix' | 'Stellar SDEX' | 'Batch Router';
  fromToken: string;
  toToken: string;
  poolFee: string;
  splitPercent: number;
}

export interface RouteOption {
  id: string;
  name: string;
  dexSources: string[];
  estimatedOutput: string;
  priceImpact: string;
  protocolFee: string;
  networkFee: string;
  executionTimeMs: number;
  mevProtected: boolean;
  steps: HopStep[];
  path: string[];
}

export interface Intent {
  id: string;
  userAddress: string;
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  amountIn: string;
  minAmountOut: string;
  maxSlippageBps: number; // e.g. 50 = 0.5%
  deadlineSeconds: number;
  executionType: ExecutionType;
  status: IntentStatus;
  createdAt: number;
  executedAmountOut?: string;
  executionHash?: string;
  calculatedRoute?: RouteOption;
}

export interface ActivityEvent {
  id: string;
  type: 'IntentSubmitted' | 'RouteCalculated' | 'SwapExecuted' | 'ExecutionFailed' | 'TransactionConfirmed' | 'IntentCancelled';
  timestamp: number;
  walletAddress: string;
  action: string;
  txHash?: string;
  intentId?: string;
  details?: string;
}

export type WalletType = 'freighter' | 'albedo' | 'xbull' | 'mock';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: string;
  walletType: WalletType | null;
  xlmBalance: string;
  tokens: Record<string, string>;
}
