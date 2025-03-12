import { PhilippinePeso } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface Props {
  state: {
    minPrice: string | null;
    maxPrice: string | null;
  };
  setMinPrice: React.Dispatch<React.SetStateAction<string | null>>;
  setMaxPrice: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function SearchPagePrice({ state, setMinPrice, setMaxPrice }: Props) {
  return (
    <div className="rounded-2xl border-[1px] p-4 shadow-md">
      <div className="flex gap-4">
        <PhilippinePeso />
        <p>Price Range</p>
      </div>
      <div className="flex items-center gap-4 py-4">
        <p>Minimum</p>
        <Slider
          value={[Number(state.minPrice) ?? 0]}
          onValueChange={(value) => {
            const newMinPrice = value[0];
            if (newMinPrice <= (Number(state.maxPrice) ?? 100000)) {
              setMinPrice(newMinPrice.toString());
            }
          }}
          step={500}
          max={100000}
        />
        <Input
          value={state.minPrice ?? ""}
          placeholder="Min Price"
          onChange={(e) => {
            const newMinPrice = e.target.value ? Number(e.target.value) : 0;
            if (newMinPrice <= (Number(state.maxPrice) ?? 100000)) {
              setMinPrice(e.target.value || null);
            }
          }}
          className="w-1/3"
          type="number"
          min="0"
          max="100000"
        />
      </div>

      <div className="flex items-center gap-4">
        <p>Maximum</p>
        <Slider
          value={[Number(state.maxPrice) ?? 100000]}
          onValueChange={(value) => {
            const newMaxPrice = value[0];
            if (newMaxPrice >= (Number(state.minPrice) ?? 0)) {
              setMaxPrice(newMaxPrice.toString());
            }
          }}
          step={500}
          max={100000}
        />
        <Input
          value={state.maxPrice ?? ""}
          placeholder="Max Price"
          onChange={(e) => {
            const newMaxPrice = e.target.value ? Number(e.target.value) : 100000;
            if (newMaxPrice >= (Number(state.minPrice) ?? 0)) {
              setMaxPrice(e.target.value || null); 
            }
          }}
          className="w-1/3"
          type="number"
          min="0"
          max="100000"
        />
      </div>
    </div>
  );
}
