import {
  Aptos,
  AptosConfig,
  Network,
  Account,
  Ed25519PrivateKey,
  Ed25519PublicKey,
} from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";

export const useAptosCall = () => {
  const {
    account,
    signAndSubmitTransaction,
    signTransaction,
    changeNetwork,
    network,
    wallet,
  } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const [result, setResult] = useState<any>();

  const executeTransaction = async (functionName: string, args: any[]) => {
    if (!account) {
      console.log("Wallet account is not available");
      return;
    }

    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);
    const CONTRACT_ADDRESS =
      "0x4bc46f0bdaa6283ef3b55abd2ba1e817e4d44fa276a754399247dc6930421a1c";
    const MODULE = "reward";

    try {
      setLoading(true);
      let committedTransaction;

      // Fee Payer 없이 일반 트랜잭션
      committedTransaction = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${CONTRACT_ADDRESS}::${MODULE}::${functionName}`,
          functionArguments: args,
        },
      });

      const executedTransaction = await aptos.waitForTransaction({
        transactionHash: committedTransaction.hash,
      });

      setResult(executedTransaction);
    } catch (error) {
      console.error("Transaction signing or waiting error:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { executeTransaction, loading, error, result };
};
