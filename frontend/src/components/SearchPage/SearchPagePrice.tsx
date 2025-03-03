import { PhilippinePeso } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface Props {
  state: {
    minPrice: string;
    maxPrice: string;
  };
  setMinPrice: React.Dispatch<React.SetStateAction<string>>;
  setMaxPrice: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchPagePrice({ state, setMinPrice, setMaxPrice }: Props) {
  return (
    <div className="rounded-2xl border-[1px] p-4">
      <div className="flex gap-4">
        <PhilippinePeso />
        <p>Price Range</p>
      </div>
      <div className="flex items-center gap-4 py-4">
        <p>Minimum</p>
        <Slider
          value={[Number(state.minPrice) || 0]}
          onValueChange={(value) => {
            const newMinPrice = value[0];
            if (newMinPrice <= Number(state.maxPrice)) {
              setMinPrice(newMinPrice.toString());
            }
          }}
          step={500}
          max={100000}
        />
        <Input
          value={state.minPrice}
          onChange={(e) => {
            const newMinPrice = Number(e.target.value);
            if (newMinPrice <= Number(state.maxPrice)) {
              setMinPrice(e.target.value);
            }
          }}
          className="w-1/3"
        />
      </div>
      <div className="flex items-center gap-4">
        <p>Maximum</p>
        <Slider
          value={[Number(state.maxPrice) || 0]}
          onValueChange={(value) => {
            const newMaxPrice = value[0];
            if (newMaxPrice >= Number(state.minPrice)) {
              setMaxPrice(newMaxPrice.toString());
            }
          }}
          step={500}
          max={100000}
        />
        <Input
          value={state.maxPrice}
          onChange={(e) => {
            const newMaxPrice = Number(e.target.value);
            if (newMaxPrice >= Number(state.minPrice)) {
              setMaxPrice(e.target.value);
            }
          }}
          className="w-1/3"
        />
      </div>
    </div>
  );
}
