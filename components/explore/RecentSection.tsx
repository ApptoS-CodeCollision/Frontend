import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Card from "./Card";
import AIDetailsPopup from "./AIDetailsPopup";
import { CardData } from "@/utils/interface";
import { DialogTitle } from "@radix-ui/react-dialog";

interface RecentSectionProps {
  title: string;
  trendCards: CardData[] | null;
  refreshData: () => void;
}

const RecentSection: React.FC<RecentSectionProps> = ({
  title,
  trendCards,
  refreshData,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mb-6">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        {trendCards?.map((item: CardData) => (
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

export default RecentSection;
