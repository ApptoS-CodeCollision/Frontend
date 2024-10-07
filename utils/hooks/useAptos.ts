import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const useAptos = async () => {
  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);
  const chainId = await aptos.getChainId();

  return { aptos, chainId };
};
