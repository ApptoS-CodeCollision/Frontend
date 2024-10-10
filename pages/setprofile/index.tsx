import { useState } from "react";
import { useRouter } from "next/router";
import ProfileForm from "@/components/profile/ProfileForm";
import { addUser } from "@/utils/api/user";
import { useUserStore } from "@/store/userStore";
import { User } from "@/utils/interface";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useAptosCall } from "@/utils/hooks/useAptos";
import {
  Aptos,
  AptosConfig,
  Network,
  Account,
  Ed25519PrivateKey,
} from "@aptos-labs/ts-sdk";

const SetProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { wallet, setUser } = useUserStore();
  const { account, signAndSubmitTransaction } = useWallet();
  const { executeTransaction, loading, error, result } = useAptosCall();

  const handleSubmit = async (profileData: {
    selectedProfile: string;
    gender: string;
    country: string;
    interest: string;
  }) => {
    setIsLoading(true);
    try {
      if (!wallet || !wallet.address) {
        throw new Error("Wallet address is not available");
      }
      console.log(1);
      await executeTransaction("test_add_rag", ["sububub_test"]);
      console.log(result);
      // const userData: User = {
      //   user_address: wallet.address,
      //   nickname: "", // Add nickname if needed
      //   profile_image_url: profileData.selectedProfile,
      //   gender: profileData.gender,
      //   country: profileData.country,
      //   interest: profileData.interest,
      // };

      // const result = await addUser(userData);
      // setUser(result);
      // router.push("/explore");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] min-h-screen mx-auto bg-[#1F222A] flex flex-col px-6 text-white">
      <h1 className="text-3xl text-white font-bold mb-4">
        Complete your profile
      </h1>
      <p className="text-lg text-gray-400 mb-8">Select a profile picture!</p>

      <ProfileForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitText="Create Account"
      />
    </div>
  );
};

export default SetProfilePage;
