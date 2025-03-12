import { PhilippinePeso } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@/components/ui/popover";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Slider } from "../ui/slider";
import { Input } from "../ui/input";

interface SearchPriceProps {
  state: {
    minPrice: string | null;
    maxPrice: string | null;
  };
  setMinPrice: React.Dispatch<React.SetStateAction<string | null>>;
  setMaxPrice: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function SearchPrice({ state, setMinPrice, setMaxPrice }: SearchPriceProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex h-full w-full justify-start gap-4 px-6 pr-8 shadow-lg">
          <PhilippinePeso />
          <div className="flex h-full flex-col justify-center text-left">
            <div>
              <p className="text-md font-bold">Price</p>
              <p className="text-xs">
                {state.minPrice == null && state.maxPrice == null
                  ? "Enter your budget"
                  : "PHP " +
                    (state.minPrice ? state.minPrice : " start ") +
                    " to " +
                    "PHP " +
                    (state.maxPrice ? state.maxPrice : " end ")}
              </p>
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="sm:w-[400px]">
        <div className="text-center">
          <p className="pb-3">Set your price range</p>
          <DropdownMenuSeparator />
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
      </PopoverContent>
    </Popover>
  );
}
