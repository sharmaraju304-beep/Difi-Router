import { useWalletStore } from "@/store/useWalletStore";

export function useWallet() {
  const isConnected = useWalletStore((s) => s.isConnected);
  const address = useWalletStore((s) => s.address);
  const network = useWalletStore((s) => s.network);
  const walletType = useWalletStore((s) => s.walletType);
  const xlmBalance = useWalletStore((s) => s.xlmBalance);
  const tokens = useWalletStore((s) => s.tokens);
  const isModalOpen = useWalletStore((s) => s.isModalOpen);
  const error = useWalletStore((s) => s.error);
  const isLoading = useWalletStore((s) => s.isLoading);

  const connect = useWalletStore((s) => s.connect);
  const disconnect = useWalletStore((s) => s.disconnect);
  const setModalOpen = useWalletStore((s) => s.setModalOpen);
  const refreshBalances = useWalletStore((s) => s.refreshBalances);

  return {
    isConnected,
    address,
    network,
    walletType,
    xlmBalance,
    tokens,
    isModalOpen,
    error,
    isLoading,
    connect,
    disconnect,
    setModalOpen,
    refreshBalances,
  };
}
