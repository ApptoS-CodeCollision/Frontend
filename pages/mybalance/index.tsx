// pages/my-balance.tsx
import { useEffect } from "react";

import { useUserStore } from "@/store/userStore";
import AIBalanceCard from "@/components/mybalance/AIBalanceCard";
import BalanceOverview from "@/components/mybalance/BalanceOverview";
import { useLoadAIModels } from "@/utils/hooks/useLoadAIModels";

const MyBalancePage = () => {
  const { user } = useUserStore();
  // 'myAI' 모드로 useLoadAIModels 사용
  const {
    cards: myAIs,
    isLoading,
    loadAIModels,
  } = useLoadAIModels(
    "myAI",
    user?.user_address // user_address를 전달
  );

  // 페이지가 로드될 때 AI 모델들을 불러오는 함수 호출
  useEffect(() => {
    if (user?.user_address) {
      loadAIModels();
    }
  }, [user?.user_address, loadAIModels]);

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!user?.user_address) {
    return (
      <div className="text-white">
        Please connect your wallet to view your balance.
      </div>
    );
  }

  const totalEarnings =
    myAIs?.reduce((sum, ai) => sum + ai.total_token_usage * 0.0017, 0) || 0;
  const totalBalance = 0; // This should be fetched from an API or calculated

  return (
    <div className="">
      <BalanceOverview
        totalBalance={totalBalance}
        totalEarnings={totalEarnings}
      />
      <h2 className="text-white text-xl font-semibold mb-4">
        Overview of My Creations
      </h2>
      {myAIs?.map((ai) => (
        <AIBalanceCard
          key={ai.id}
          name={ai.name}
          category={ai.category}
          imageSrc={ai.profile_image_url}
          usage={ai.total_token_usage}
          earnings={ai.total_token_usage * 0.0017}
        />
      ))}
    </div>
  );
};

export default MyBalancePage;

export async function getStaticProps() {
  return {
    props: {
      title: "My Balance",
    },
  };
}
