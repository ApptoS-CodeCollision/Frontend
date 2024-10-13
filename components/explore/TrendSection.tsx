import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Card from "./Card";
import AIDetailsPopup from "./AIDetailsPopup";
import { CardData } from "@/utils/interface";
import { DialogTitle } from "@radix-ui/react-dialog";
import useSWR from 'swr';
import { AI_API, fetchers } from "@/utils/api/ai";
import { useUserStore } from "@/store/userStore";

interface TrendSectionProps {
  title: string;
  selectedCategory: string;
  refreshData: () => void;
}

const TrendSection: React.FC<TrendSectionProps> = ({
  title,
  selectedCategory,
  refreshData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserStore();
  const { data : trendData, error, isLoading } = useSWR(`${AI_API.TREND(user?.user_address!, selectedCategory)}?offset=${0}&limit=${10}`, fetchers);
  
  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>

  return (
    <section className="mb-6">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        {trendData?.ais.map((item: CardData) => (
          <div key={item.id}>
            <Dialog
              onOpenChange={(open) => {
                setIsOpen(open);
              }}
            >
              <DialogTrigger asChild>
                <div className="cursor-pointer">
                  <Card
                    ai_id={item.id}
                    name={item.name}
                    category={item.category}
                    like={item.like}
                    refreshData={refreshData}
                  />
                </div>
              </DialogTrigger>

              {isOpen && (
                <DialogContent>
                  <DialogTitle />
                  <AIDetailsPopup ai_detail={item} />
                </DialogContent>
              )}
            </Dialog>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendSection;
