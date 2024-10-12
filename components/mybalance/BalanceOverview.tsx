// components/BalanceOverview.tsx
import { useUserStore } from "@/store/userStore";
import { requsetFaucet } from "@/utils/api/user";
import { useAptosCall } from "@/utils/hooks/useAptos";
import { Plus } from "lucide-react";

interface BalanceOverviewProps {
  totalBalance: number;
  totalEarnings: number;
  trial: number;
}

const BalanceOverview: React.FC<BalanceOverviewProps> = ({
  totalBalance,
  totalEarnings,
  trial,
}) => {
  const { user } = useUserStore();
  const { executeTransaction } = useAptosCall();
  const handleRequest = async () => {
    if (user?.user_address) {
      const result = await requsetFaucet(user?.user_address);
      console.log(result);
    }
  };

  const handleCharge = async () => {
    if (user?.user_address) {
      const result = await executeTransaction("recharge_consumer_balance", [
        10000,
      ]);
      console.log(result);
    }
  };

  return (
    <div className="bg-primary-900 bg-opacity-[42%] rounded-xl p-4 mb-6 text-center">
      <div className="flex justify-between mb-4">
        <div className="flex-1 pr-2">
          <p className="text-[#B9F0DE] text-sm mb-1">My Balance</p>
          <p className="text-white text-2xl font-bold">
            $ {totalBalance.toLocaleString()}
          </p>
        </div>
        <div className="w-px bg-[#B9F0DE] self-stretch mx-2"></div>
        <div className="flex-1 pl-2">
          <p className="text-[#B9F0DE] text-sm mb-1">Earnings</p>
          <p className="text-white text-2xl font-bold">
            $ {totalEarnings.toLocaleString()}
          </p>
        </div>
      </div>
      {trial == 0 ? (
        <div className="flex place-content-between">
          <button onClick={handleRequest}>Requst Faucet!</button>
          <button onClick={handleCharge}>Charge!</button>
        </div>
      ) : (
        <p>Free Trial : {trial} Left</p>
      )}
    </div>
  );
};

export default BalanceOverview;
