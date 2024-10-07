// components/BalanceOverview.tsx
import { Plus } from "lucide-react";

interface BalanceOverviewProps {
  totalBalance: number;
  totalEarnings: number;
  remainTrial: number;
  handleChargeClick: () => void;
}

const BalanceOverview: React.FC<BalanceOverviewProps> = ({
  totalBalance,
  totalEarnings,
  remainTrial,
  handleChargeClick,
}) => {
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
      {remainTrial > 0 ? (
        <div>Free Trial {remainTrial} Left</div>
      ) : (
        <button
          className="w-full bg-primary-900 text-white py-1 rounded-full font-semibold flex items-center justify-center"
          onClick={handleChargeClick}
        >
          <Plus className="mr-2" /> Charge
        </button>
      )}
    </div>
  );
};

export default BalanceOverview;
