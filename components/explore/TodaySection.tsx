import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import AIDetailsPopup from "./AIDetailsPopup";
import { CardData } from "@/utils/interface";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import avatarImage from "@/assets/avatar.png";
import { useUserStore } from "@/store/userStore";
import { Heart, ArrowRight } from "lucide-react";
import { useRouter } from "next/router";
import { useLikeHandler } from "@/utils/hooks/useLikeHandler";
import { sliderSettings } from "@/utils/lib/sliderSettings";

interface TodaySectionProps {
  isLoading: boolean;
  todayCards: CardData[] | null;
  setSelectedAI: (ai: CardData | null) => void;
  refreshData: () => void;
}

const TodaySection: React.FC<TodaySectionProps> = ({
  isLoading,
  todayCards,
  setSelectedAI,
  refreshData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserStore();
  const router = useRouter();
  const [showArrows, setShowArrows] = useState(false);
  const { handleLikeClick } = useLikeHandler(refreshData);
  const [localCards, setLocalCards] = useState<CardData[] | null>(todayCards); // 기존 데이터를 저장하는 상태

  useEffect(() => {
    if (todayCards) {
      setLocalCards(todayCards); // 새로 받은 데이터로 업데이트
    }
  }, [todayCards]);

  useEffect(() => {
    const handleResize = () => {
      setShowArrows(window.innerWidth >= 450);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChatClick = (e: React.MouseEvent, item: CardData) => {
    e.stopPropagation();
    router.push(`/ai/${item.id}/chat`);
  };

  const dynamicSliderSettings = {
    ...sliderSettings, // 기본 설정을 복사
    arrows: showArrows, // showArrows에 따른 arrows 속성 추가
  };

  return (
    <section className="mb-6">
      <h2 className="text-lg font-bold mb-4">Today</h2>
      {isLoading && !localCards ? ( // 첫 로딩 상태에서만 Loading... 표시
        <div>Loading...</div>
      ) : (
        <Slider {...dynamicSliderSettings}>
          {localCards?.map((item: CardData, index: number) => (
            <div key={item.id}>
              <Dialog
                onOpenChange={(open) => {
                  setIsOpen(open);
                  setSelectedAI(open ? item : null);
                }}
              >
                <DialogTrigger asChild>
                  <div className="p-2 cursor-pointer">
                    <div className="bg-gradient-custom rounded-3xl overflow-hidden relative">
                      <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-90 text-emerald-500 text-xl font-bold py-1 px-3 rounded-full">
                        #{index + 1}
                      </div>
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={(e) =>
                            handleLikeClick(e, item.id, item.like)
                          }
                        >
                          <Heart
                            color={item.like ? "#F75555" : "white"}
                            fill={item.like ? "#F75555" : "none"}
                            size={24}
                          />
                        </button>
                      </div>
                      <div className="px-6 py-10 pt-16">
                        <div className="w-32 h-32 bg-sky-200 rounded-full mx-auto mb-4 overflow-hidden">
                          <Image
                            src={item.profile_image_url || avatarImage}
                            alt={item.name}
                            width={128}
                            height={128}
                            className="object-cover"
                          />
                        </div>
                        <h3 className="text-white text-2xl font-bold text-center mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          {item.name}
                        </h3>
                        <p className="text-gray-300 text-center mb-4">
                          {item.creator || "Creator Name"}
                        </p>
                        <div className="flex justify-center">
                          <button
                            className="bg-[#35383F] bg-opacity-70 text-primary-900 py-2 px-6 rounded-full hover:bg-opacity-80 transition duration-300 flex items-center"
                            onClick={(e) => handleChatClick(e, item)}
                          >
                            Chat <ArrowRight className="ml-1 w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                {isOpen && (
                  <DialogContent>
                    <AIDetailsPopup ai_detail={item} />
                  </DialogContent>
                )}
              </Dialog>
            </div>
          ))}
        </Slider>
      )}
    </section>
  );
};

export default TodaySection;
