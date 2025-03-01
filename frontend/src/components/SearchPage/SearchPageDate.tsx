import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";

interface State {
  startDate?: string;
  endDate?: string;
}

interface SetStartDateAction {
  type: "SET_START_DATE";
  payload: string;
}

interface SetEndDateAction {
  type: "SET_END_DATE";
  payload: string;
}

type FilterAction = SetStartDateAction | SetEndDateAction;

interface Props {
  state: State;
  dispatch: React.Dispatch<FilterAction>;
}

export default function SearchPageDate({ state, dispatch }: Props) {
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
              dispatch({
                type: "SET_START_DATE",
                payload: from.toLocaleDateString() || "",
              });
            }
            if (to) {
              dispatch({
                type: "SET_END_DATE",
                payload: to.toLocaleDateString() || "",
              });
            }
          }
        }}
        className="pt-8"
      />
    </div>
  );
}
