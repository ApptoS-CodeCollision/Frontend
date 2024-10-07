// pages/my-balance.tsx
import { useEffect, useState } from "react";
import { fetchMyAIs } from "@/utils/api/ai";
import { AIDetailProps } from "@/utils/interface";
import { useUserStore } from "@/store/userStore";
import { charge, fetchTrial } from "@/utils/api/user";
import AIBalanceCard from "@/components/mybalance/AIBalanceCard";
import BalanceOverview from "@/components/mybalance/BalanceOverview";
import { useLoadAIModels } from "@/utils/hooks/useLoadAIModels";
import { useAptos } from "@/utils/hooks/useAptos";

const MyBalancePage = () => {
  const [remainTrial, setRemainTrial] = useState(0);
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

  (async () => {
    const { aptos, chainId } = await useAptos(); // Await the async function
    console.log(chainId);
  })();

  // 페이지가 로드될 때 AI 모델들을 불러오는 함수 호출
  useEffect(() => {
    if (user?.user_address) {
      loadAIModels();
    }
  }, [user?.user_address, loadAIModels]);

  const handleChargeClick = async () => {
    try {
      if (user && user.user_address) {
        const result = await charge({ user_address: user.user_address });
        window.alert("Charge Complete");
      }
    } catch (e) {
      window.alert("Charge Failed");
    }
  };

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
        remainTrial={remainTrial}
        handleChargeClick={handleChargeClick}
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
