import { useState, useEffect } from "react";
import { UserRound } from "lucide-react";
import Image from "next/image";
import GenderSelect from "@/components/profile/GenderSelect";
import CountrySelect from "@/components/profile/CountrySelect";

interface ProfileFormProps {
  initialProfileImage?: string;
  initialGender?: string;
  initialCountry?: string;
  initialInterest?: string;
  initialNickname?: string;
  onSubmit: (profileData: {
    selectedProfile: string;
    nickname: string;
    gender: string;
    country: string;
    interest: string;
  }) => Promise<void>;
  isLoading: boolean;
  submitText: string;
}

const profileImages = [
  "https://apptos.s3.ap-southeast-2.amazonaws.com/1.png",
  "https://apptos.s3.ap-southeast-2.amazonaws.com/2.png",
  "https://apptos.s3.ap-southeast-2.amazonaws.com/3.png",
];

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialProfileImage,
  initialNickname = "",
  initialGender = "",
  initialCountry = "",
  initialInterest = "",
  onSubmit,
  isLoading,
  submitText,
}) => {
  const [selectedProfile, setSelectedProfile] = useState(0);
  const [nickname, setNickname] = useState(initialNickname);
  const [gender, setGender] = useState(initialGender);
  const [country, setCountry] = useState(initialCountry);
  const [interest, setInterest] = useState(initialInterest);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialProfileImage) {
      const index = profileImages.findIndex(
        (img) => img === initialProfileImage,
      );
      setSelectedProfile(index !== -1 ? index + 1 : 0);
    }
  }, [initialProfileImage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      await onSubmit({
        selectedProfile: profileImages[selectedProfile - 1] || "",
        nickname,
        gender,
        country,
        interest,
      });
    } catch (err) {
      setError("Failed to submit. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="size-32 bg-[#2A2D36] rounded-full mb-4 mx-auto flex items-center justify-center overflow-hidden">
        {selectedProfile === 0 ? (
          <UserRound className="text-gray-400 size-24" />
        ) : (
          <Image
            src={profileImages[selectedProfile - 1]}
            alt="Selected profile"
            width={128}
            height={128}
            className="object-cover transform scale-150 translate-y-[-10%]"
          />
        )}
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        {profileImages.map((img, index) => (
          <button
            type="button"
            key={index}
            onClick={() => setSelectedProfile(index + 1)}
            className={`size-16 rounded-full overflow-hidden border-2 bg-[#2A2D36] ${
              selectedProfile === index + 1
                ? "border-primary-900"
                : "border-transparent"
            }`}
          >
            <Image
              src={img}
              alt={`Profile ${index + 1}`}
              width={64}
              height={64}
              className="object-cover transform scale-150 translate-y-[-10%]"
            />
          </button>
        ))}
      </div>

      <div>
        <label
          htmlFor="nickname"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Nickname
        </label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full p-2 border-b border-gray-600 focus:border-primary-900 focus:outline-none bg-transparent text-white"
          placeholder="Name"
          required
        />
      </div>

      <GenderSelect value={gender} onChange={setGender} />
      <CountrySelect value={country} onChange={setCountry} />

      <div>
        <label
          htmlFor="interest"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Field of Interest
        </label>
        <div className="flex">
          <input
            type="text"
            id="interest"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="flex-1 p-2 border-b border-gray-600 focus:border-primary-900 focus:outline-none bg-transparent text-white"
            placeholder="Education, Fitness, Blockchain etc..."
          />
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="pb-20 flex-shrink-0">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-900 text-white py-4 rounded-full font-medium disabled:bg-gray-600"
        >
          {isLoading ? "Loading..." : submitText}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
