import { MapPinned } from "lucide-react";
import { Button } from "../ui/button";

interface SearchPageReviewProps {
  reviewScore: string;
  setReviewScore: React.Dispatch<React.SetStateAction<string>>;
  altReviewScores: string[];
  reviewScores: string[];
}

export default function SearchPageReview({ reviewScore, setReviewScore, altReviewScores, reviewScores }: SearchPageReviewProps) {
  return (
    <div>
      <div className="flex-row items-center justify-between rounded-2xl border-[1px] p-4">
        <div className="flex gap-4">
          <MapPinned />
          <p>Review Score</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
          {reviewScores.map((review, index) => {
            return (
              <Button
                id={review.toString()}
                key={index}
                className={`w-full ${reviewScore === review ? "bg-teal-500 text-black" : ""}`}
                variant={"outline"}
                onClick={() => {
                  setReviewScore(review.toString());
                }}
              >
                <p className="text-left">
                  {altReviewScores[index]} +{reviewScores[index]}
                </p>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
