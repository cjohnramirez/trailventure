import { MapPinned } from "lucide-react";
import { Button } from "../ui/button";

type FilterAction = { type: "SET_REVIEW_SCORE"; payload: string };

interface SearchPageReviewProps {
  dispatch: React.Dispatch<FilterAction>;
  state: any;
  altReviewScores: string[];
  reviewScores: string[];
}

export default function SearchPageReview({ dispatch, state, altReviewScores, reviewScores }: SearchPageReviewProps) {
  return (
    <div>
      <div className="flex-row items-center justify-between rounded-2xl border-[1px] p-4">
        <div className="flex gap-4">
          <MapPinned />
          <p>Review Score</p>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4">
          {reviewScores.map((review, index) => {
            return (
              <Button
                id={review.toString()}
                key={index}
                className={`w-full ${state.reviewScore === review ? "bg-teal-500 text-black" : ""}`}
                variant={"outline"}
                onClick={() => {
                  dispatch({
                    type: "SET_REVIEW_SCORE",
                    payload: review.toString(),
                  });
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
