import { Heart } from "lucide-react";
import { useLikeHandler } from "@/utils/hooks/useLikeHandler";

interface CardProps {
  ai_id: string;
  name: string;
  category: string;
  like: boolean;
  refreshData: () => void;
}

const Card: React.FC<CardProps> = ({
  ai_id,
  name,
  category,
  like,
  refreshData,
}) => {
  const { handleLikeClick } = useLikeHandler(refreshData); // useLikeHandler 사용

  return (
    <div className="p-4 bg-[#1F222A] rounded-[16px] shadow-md relative flex flex-col">
      <div className="bg-primary-900 rounded-[16px] size-14 mb-4"></div>
      <div className="flex-grow flex flex-col">
        <h3 className="text-sm font-semibold mb-2">{name}</h3>
        <p className="text-xs text-gray-500">{category}</p>
      </div>
      <button
        className="absolute top-3 right-3"
        onClick={(e) => handleLikeClick(e, ai_id, like)}
      >
        <Heart
          color={like ? "#F75555" : "white"}
          fill={like ? "#F75555" : "none"}
          size={24}
        />
      </button>
    </div>
  );
};

export default Card;
