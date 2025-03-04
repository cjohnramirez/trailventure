import { PhilippinePeso } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@/components/ui/popover";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Slider } from "../ui/slider";
import { Input } from "../ui/input";

interface SearchPriceProps {
  minimumPrice: number[] | null;
  maximumPrice: number[] | null;
  setMinimumPrice: (value: number[]) => void;
  setMaximumPrice: (value: number[]) => void;
}

export default function SearchPrice({
  minimumPrice,
  maximumPrice,
  setMinimumPrice,
  setMaximumPrice,
}: SearchPriceProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex h-full w-full justify-start gap-4 px-6 pr-8 "
        >
          <PhilippinePeso />
          <div className="flex h-full flex-col justify-center text-left">
            <div>
              <p className="text-md font-bold">Price</p>
              <p className="text-xs">
                {minimumPrice &&
                minimumPrice[0] === 580 &&
                maximumPrice &&
                maximumPrice[0] === 12000
                  ? "Enter your budget"
                  : "PHP " + minimumPrice + " to " + "PHP " + maximumPrice}
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
        <div className="flex flex-col gap-8 pb-2 pt-4">
          <div className="flex items-center gap-4">
            <p className="hidden sm:block">Minimum</p>
            <p className="block sm:hidden">Min</p>
            <Slider
              defaultValue={[580]}
              max={100000}
              step={100}
              min={580}
              onValueChange={(e) => {
                if (e[0] <= maximumPrice![0]) {
                  setMinimumPrice(e);
                }
              }}
              value={minimumPrice!}
            />
            <Input
              className="sm:w-2/5"
              onChange={(e) => {
                if (Number(e.target.value) <= maximumPrice![0]) {
                  setMinimumPrice([Number(e.target.value)]);
                }
              }}
              value={minimumPrice![0]}
            ></Input>
          </div>
          <div className="flex items-center gap-4">
            <p className="hidden sm:block">Maximum</p>
            <p className="block sm:hidden">Max</p>
            <Slider
              defaultValue={[50]}
              max={100000}
              step={100}
              min={580}
              onValueChange={(e) => {
                if (e[0] >= minimumPrice![0]) {
                  setMaximumPrice(e);
                }
              }}
              value={maximumPrice!}
            />
            <Input
              className="sm:w-2/5"
              onChange={(e) => {
                if (Number(e.target.value) >= minimumPrice![0]) {
                  setMaximumPrice([Number(e.target.value)]);
                }
              }}
              value={maximumPrice![0]}
            ></Input>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
