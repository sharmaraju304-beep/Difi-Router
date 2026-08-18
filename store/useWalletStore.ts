import { create } from "zustand";
import { WalletState, WalletType } from "@/types/intent";
import { connectFreighter, connectAlbedo, connectXBull, connectMockWallet } from "@/lib/wallet/kit";
import { fetchAccountBalances } from "@/lib/stellar/client";

interface WalletStoreActions {
  connect: (type: WalletType) => Promise<void>;
  disconnect: () => void;
  refreshBalances: () => Promise<void>;
  setModalOpen: (open: boolean) => void;
  isModalOpen: boolean;
  error: string | null;
  isLoading: boolean;
}

export const useWalletStore = create<WalletState & WalletStoreActions>((set, get) => ({
  isConnected: false,
  address: null,
  network: "TESTNET",
  walletType: null,
  xlmBalance: "0",
  tokens: {},
  isModalOpen: false,
  error: null,
  isLoading: false,

  setModalOpen: (open: boolean) => set({ isModalOpen: open, error: null }),

  connect: async (type: WalletType) => {
    set({ isLoading: true, error: null });
    try {
      let res;
      if (type === "freighter") res = await connectFreighter();
      else if (type === "albedo") res = await connectAlbedo();
      else if (type === "xbull") res = await connectXBull();
      else res = await connectMockWallet();

      const balances = await fetchAccountBalances(res.address);
      set({
        isConnected: true,
        address: res.address,
        walletType: res.walletType,
        network: res.network,
        xlmBalance: balances.XLM || "0",
        tokens: balances,
        isLoading: false,
        isModalOpen: false,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err?.message || "Failed to connect wallet.",
      });
    }
  },

  disconnect: () => {
    set({
      isConnected: false,
      address: null,
      walletType: null,
      xlmBalance: "0",
      tokens: {},
      error: null,
    });
  },

  refreshBalances: async () => {
    const { address } = get();
    if (!address) return;
    const balances = await fetchAccountBalances(address);
    set({
      xlmBalance: balances.XLM || "0",
      tokens: balances,
    });
  },
}));
