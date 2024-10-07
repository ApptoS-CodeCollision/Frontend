import { useState } from "react";
import { useRouter } from "next/router";
import ProfileForm from "@/components/profile/ProfileForm";
import { updateUser } from "@/utils/api/user";
import { useUserStore } from "@/store/userStore";

const EditProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, setUser } = useUserStore();

  const handleSubmit = async (profileData: {
    selectedProfile: string;
    gender: string;
    country: string;
    interest: string;
  }) => {
    setIsLoading(true);
    try {
      if (!user || !user.user_address) {
        throw new Error("Wallet address is not available");
      }
      const updatedUserData = {
        user_address: user.user_address,
        profile_image_url: profileData.selectedProfile,
        gender: profileData.gender,
        country: profileData.country,
        interest: profileData.interest,
        trial: user.trial,
      };

      const result = await updateUser(updatedUserData);
      setUser(result);
      router.push("/mypage");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto flex flex-col text-white">
      <p className="text-lg text-gray-400 mb-8">
        Update your profile information
      </p>

      <ProfileForm
        initialProfileImage={user?.profile_image_url}
        initialGender={user?.gender}
        initialCountry={user?.country}
        initialInterest={user?.interest}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitText="Update Profile"
      />
    </div>
  );
};

export default EditProfilePage;
