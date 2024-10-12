import {
  Aptos,
  AptosConfig,
  Network,
  Account,
  Ed25519PrivateKey,
  Ed25519PublicKey,
  InputViewFunctionData,
} from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";

export const useAptosCall = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);
  const CONTRACT_ADDRESS =
    "0xa7c3ee3504ffa6398dd9e5f3e3d31d3b16b237a38e7599c644c68308d95a664d";
  const MODULE = "reward";

  const executeTransaction = async (functionName: string, args: any[]) => {
    if (!account) {
      console.log("Wallet account is not available");
      return;
    }

    try {
      setLoading(true);

      // Fee Payer 없이 일반 트랜잭션
      let committedTransaction = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${CONTRACT_ADDRESS}::${MODULE}::${functionName}`,
          typeArguments: [],
          functionArguments: args,
        },
      });

      const executedTransaction = await aptos.waitForTransaction({
        transactionHash: committedTransaction.hash,
      });

      return executedTransaction;
    } catch (error) {
      console.error("Transaction signing or waiting error:", error);
      setError(error);

      return false;
    } finally {
      setLoading(false);
    }
  };

  const viewTransaction = async (functionName: string, args: any[]) => {
    try {
      setLoading(true);
      const payload: InputViewFunctionData = {
        function: `${CONTRACT_ADDRESS}::${MODULE}::${functionName}`,
        functionArguments: args,
      };
      const res = (await aptos.view({ payload }))[0];

      return res;
    } catch (error) {
      console.error("Transaction signing or waiting error:", error);
      setError(error);

      return false;
    } finally {
      setLoading(false);
    }
  };
  return { executeTransaction, viewTransaction };
};
