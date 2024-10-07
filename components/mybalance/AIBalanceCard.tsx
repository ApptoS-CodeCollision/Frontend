// components/AIBalanceCard.tsx
import Image from "next/image";
import avatarImage from "@/assets/avatar.png";

interface AIBalanceCardProps {
  name: string;
  category: string;
  imageSrc?: string;
  usage: number;
  earnings: number;
}

const AIBalanceCard: React.FC<AIBalanceCardProps> = ({
  name,
  category,
  imageSrc,
  usage,
  earnings,
}) => {
  return (
    <div className="bg-[#2A2D36] rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center flex-grow mr-4">
          <Image
            src={imageSrc || avatarImage}
            alt={name}
            width={48}
            height={48}
            className="rounded-full mr-3 flex-shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <h3 className="text-lg text-white font-semibold truncate max-w-[150px]">
              {name}
            </h3>
            <div className="flex items-center mt-1">
              <span className="text-xs text-primary-900 px-2 py-1 rounded-full border border-primary-900 whitespace-nowrap">
                {category}
              </span>
            </div>
          </div>
        </div>
        <button className="text-primary-900 font-medium flex-shrink-0">
          Collect
        </button>
      </div>
      <div className="flex mt-4 divide-x divide-gray-300">
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500">Usage</p>
          <p className="text-lg text-white">{usage} tokens</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500">Earnings</p>
          <p className="text-lg text-white">$ {earnings.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default AIBalanceCard;
