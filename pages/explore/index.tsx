import { useEffect, useState } from "react";
import { fetchTodayAIs, fetchTrendingAIs } from "@/utils/api/ai";
import { CardData } from "@/utils/interface";
import CategorySelector, {
  CategoryKey,
  categories,
} from "@/components/explore/CategorySelector";
import TodaySection from "@/components/explore/TodaySection";
import RecentSection from "@/components/explore/RecentSection";
import { useUserStore } from "@/store/userStore";
import { useLoadAIModels } from "@/utils/hooks/useLoadAIModels";

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");
  const [selectedAI, setSelectedAI] = useState<CardData | null>(null);
  const { user } = useUserStore();

  // 'explore' 모드로 설정하여 데이터 로드
  const { todayCards, trendCards, isLoading, loadAIModels } = useLoadAIModels(
    "explore",
    user?.user_address,
    selectedCategory, // 카테고리 적용
  );

  useEffect(() => {
    if (user?.user_address) {
      loadAIModels(); // 페이지 처음 로드될 때도 호출되도록 설정
    }
  }, [user]); // 의존성 배열에 `user` 추가

  useEffect(() => {
    loadAIModels();
  }, [selectedCategory]);

  return (
    <div className="p-4 pb-16">
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      {selectedCategory === "all" && (
        <TodaySection
          isLoading={isLoading}
          todayCards={todayCards}
          setSelectedAI={setSelectedAI}
          refreshData={loadAIModels}
        />
      )}
      <RecentSection
        title={selectedCategory === "all" ? "Weekly Trends" : selectedCategory}
        trendCards={trendCards}
        setSelectedAI={setSelectedAI}
        refreshData={loadAIModels}
      />
    </div>
  );
}
