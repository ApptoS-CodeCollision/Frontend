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

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");
  const [selectedAI, setSelectedAI] = useState<CardData | null>(null);
  const [todayCards, setTodayCards] = useState<CardData[] | null>(null);
  const [trendCards, setTrendCards] = useState<CardData[] | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserStore();

  useEffect(() => {
    const loadAIModels = async () => {
      if (user && user.user_address) {
        try {
          const Todaydata = await fetchTodayAIs(user.user_address);
          setTodayCards(Todaydata.ais);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
        }
      }
    };
    loadAIModels();
  }, []);

  useEffect(() => {
    const loadAIModels = async () => {
      if (user && user.user_address) {
        try {
          const Trenddata = await fetchTrendingAIs(
            selectedCategory,
            user.user_address,
            { offset: 0, limit: 10 }
          );
          setTrendCards(
            Trenddata.ais.sort(
              (a: CardData, b: CardData) =>
                b.daily_user_access - a.daily_user_access
            )
          );
        } catch (error) {
          console.error(error);
        }
      }
    };
    loadAIModels();
  }, [selectedCategory]);

  return (
    <div className="p-4 pb-16">
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      {selectedCategory === "all" ? (
        <>
          <TodaySection
            isLoading={isLoading}
            todayCards={todayCards}
            setSelectedAI={setSelectedAI}
          />
          <RecentSection
            title={"Weekly Trends"}
            trendCards={trendCards}
            setSelectedAI={setSelectedAI}
          />
        </>
      ) : (
        <RecentSection
          title={selectedCategory}
          trendCards={trendCards}
          setSelectedAI={setSelectedAI}
        />
      )}
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title: "Explore",
    },
  };
}
