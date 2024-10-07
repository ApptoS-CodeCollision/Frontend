import React from "react";
import Image from "next/image";
import Link from "next/link";
import avatarImage from "@/assets/avatar.png";

interface AICardProps {
  id: string;
  name: string;
  category: string;
  profile_image_url?: string;
  introductions: string;
}

const AICard: React.FC<AICardProps> = ({
  id,
  name,
  category,
  profile_image_url,
  introductions,
}) => {
  return (
    <div className="bg-[#2A2D36] rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-grow mr-4">
          <Image
            src={profile_image_url || avatarImage}
            alt={name}
            width={48}
            height={48}
            className="rounded-full mr-3 flex-shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <h3 className="text-lg font-semibold text-white truncate max-w-[200px]">
              {name}
            </h3>
            <div className="flex items-center mt-1">
              <span className="text-xs text-primary-900 px-2 py-1 rounded-full border border-primary-900 whitespace-nowrap">
                {category}
              </span>
            </div>
          </div>
        </div>
        <Link
          href={`/ai/${id}/edit`}
          className="text-primary-900 font-medium text-lg flex items-center flex-shrink-0"
        >
          Edit AI
        </Link>
      </div>
    </div>
  );
};

export default AICard;
