import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";

interface Props {
  state: {
    startDate: string;
    endDate: string;
  };
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchPageDate({ state, setStartDate, setEndDate }: Props) {
  return (
    <div className="flex flex-col items-center rounded-2xl border-[1px] p-8">
      <div className="flex w-full gap-4 rounded-2xl border-[1px] p-4">
        <CalendarIcon />
        <p>Set Date Range</p>
      </div>
      <Calendar
        mode="range"
        selected={{
          from: state.startDate ? new Date(state.startDate) : undefined,
          to: state.endDate ? new Date(state.endDate) : undefined,
        }}
        onSelect={(range) => {
          if (range) {
            const { from, to } = range;
            if (from) {
              setStartDate(from.toLocaleDateString() || "")
            }
            if (to) {
              setEndDate(to.toLocaleDateString() || "")
            }
          }
        }}
        className="pt-8"
      />
    </div>
  );
}
