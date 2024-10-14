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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useAptosCall = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);
  const CONTRACT_ADDRESS =
    "0x2d6a07c03db78404740d6532ab479aed9880ecc4e9782c374e145b1172205088";
  const MODULE = "reward";
  const router = useRouter();

  const executeTransaction = async (functionName: string, args: any[]) => {
    if (!account) {
      window.alert(
        "Wallet account is not available. Please Connect wallet Again"
      );
      router.push("/");
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
