import { TokenInfo } from "@/types/intent";

export const STELLAR_CONFIG = {
  network: "TESTNET",
  networkPassphrase: "Test SDF Network ; September 2015",
  rpcUrl: "https://soroban-testnet.stellar.org",
  horizonUrl: "https://horizon-testnet.stellar.org",
  explorerBaseUrl: "https://stellar.expert/explorer/testnet",
  contractId: process.env.NEXT_PUBLIC_SOROBAN_CONTRACT_ID || "CA2GHTJIPOVJIUQUU2XVU6E32LOAWCJFJC7JQSOT2JB2P7HHBMAMHFS5",
};

export const SUPPORTED_TOKENS: TokenInfo[] = [
  {
    symbol: "XLM",
    name: "Stellar Lumens",
    code: "XLM",
    contractId: "CDLZFC3SYJYDVR7P67SC7G3ZAMN6GAKGIZKWEX42MYWK32WTYEY52SZW", // Native SAC Testnet
    decimals: 7,
    icon: "⚡",
  },
  {
    symbol: "USDC",
    name: "USD Coin (Testnet)",
    code: "USDC",
    issuer: "GBBD47IF6LWK7P7MDEVSCWR7DPCCM3GHXYCCEDA2SRYPXQGB6GXTCCYA",
    contractId: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WFAKX3YWIC5LHESWW67",
    decimals: 7,
    icon: "💵",
  },
  {
    symbol: "AQUA",
    name: "Aqua Token",
    code: "AQUA",
    issuer: "GBBD47IF6LWK7P7MDEVSCWR7DPCCM3GHXYCCEDA2SRYPXQGB6GXTCCYA",
    contractId: "CAQUA1234567890BCDEFGHIJKLMNOPQRSTUVWXYZ1234567890BCDEFG",
    decimals: 7,
    icon: "💧",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    code: "USDT",
    issuer: "GBBD47IF6LWK7P7MDEVSCWR7DPCCM3GHXYCCEDA2SRYPXQGB6GXTCCYA",
    contractId: "CUSDT1234567890BCDEFGHIJKLMNOPQRSTUVWXYZ1234567890BCDEFG",
    decimals: 7,
    icon: "₮",
  },
];
