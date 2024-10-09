import {
  Aptos,
  AptosConfig,
  Network,
  Account,
  Ed25519PrivateKey,
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
  } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const [result, setResult] = useState<any>();
  useEffect(() => {
    // 네트워크를 강제로 TESTNET으로 변경
    changeNetwork(Network.TESTNET);
  }, []);

  const executeTransaction = async (functionName: string, sponsor: boolean) => {
    if (!account) {
      console.log("Wallet account is not available");
    }
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);
    const CONTRACT_ADDRESS =
      "0x4bc46f0bdaa6283ef3b55abd2ba1e817e4d44fa276a754399247dc6930421a1c";
    const MODULE = "reward";
    const feePayerPrivateKey = process.env.NEXT_PUBLIC_FEE_PAYER;
    if (!feePayerPrivateKey) {
      throw new Error(
        "FEE_PAYER private key is not defined in environment variables."
      );
    }

    // Account 객체 생성
    const feePayerAccount = Account.fromPrivateKey({
      privateKey: new Ed25519PrivateKey(feePayerPrivateKey),
    });
    try {
      setLoading(true);

      // 트랜잭션 빌드
      const transaction = await aptos.transaction.build.simple({
        sender: account?.address || "",
        data: {
          function: `${CONTRACT_ADDRESS}::${MODULE}::${functionName}`,
          functionArguments: [account?.address],
        },
      });

      let committedTransaction;

      if (sponsor) {
        // Fee Payer를 사용한 트랜잭션
        const payload = {
          type: "entry_function_payload",
          function: `${CONTRACT_ADDRESS}::${MODULE}::${functionName}`,
          type_arguments: [],
          arguments: [account?.address],
        };
        const response = await signTransaction(payload);

        const feePayerAuthenticator = aptos.transaction.signAsFeePayer({
          signer: feePayerAccount,
          transaction,
        });

        committedTransaction = await aptos.transaction.submit.simple({
          transaction,
          senderAuthenticator: response,
          feePayerAuthenticator: feePayerAuthenticator,
        });
      } else {
        // Fee Payer 없이 일반 트랜잭션
        committedTransaction = await signAndSubmitTransaction({
          sender: account?.address || "",
          data: {
            function: `${CONTRACT_ADDRESS}::${MODULE}::${functionName}`,
            functionArguments: [account?.address],
          },
        });
      }

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
