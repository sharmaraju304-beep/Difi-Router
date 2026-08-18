import { isConnected, getPublicKey, requestAccess } from "@stellar/freighter-api";
import { WalletType } from "@/types/intent";

export interface WalletConnectResult {
  address: string;
  walletType: WalletType;
  network: string;
}

export async function connectFreighter(): Promise<WalletConnectResult> {
  const connected = await isConnected();
  if (!connected) {
    throw new Error("Freighter wallet extension is not installed in your browser.");
  }
  const accessRes = await requestAccess();
  if (typeof accessRes === "string" && accessRes.startsWith("G")) {
    return {
      address: accessRes,
      walletType: "freighter",
      network: "TESTNET",
    };
  }
  const pubKey = await getPublicKey();
  if (!pubKey) {
    throw new Error("Failed to retrieve public key from Freighter wallet.");
  }
  return {
    address: pubKey,
    walletType: "freighter",
    network: "TESTNET",
  };
}

export async function connectAlbedo(): Promise<WalletConnectResult> {
  // Demo mock or Albedo intent handler
  const mockAddr = "GBBD47IF6LWK7P7MDEVSCWR7DPCCM3GHXYCCEDA2SRYPXQGB6GXTCCYA";
  return {
    address: mockAddr,
    walletType: "albedo",
    network: "TESTNET",
  };
}

export async function connectXBull(): Promise<WalletConnectResult> {
  const mockAddr = "GDF2K4P4G6W6P3X5Z2V7N8M9K0L1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5";
  return {
    address: mockAddr,
    walletType: "xbull",
    network: "TESTNET",
  };
}

export async function connectMockWallet(): Promise<WalletConnectResult> {
  const mockAddr = "GDTESTNETROUTERUSER1234567890ABCDEFGHIJKLMNOPQRSTUV";
  return {
    address: mockAddr,
    walletType: "mock",
    network: "TESTNET",
  };
}
