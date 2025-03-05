import "./loading.css"
import { useGlobalStore } from "../Contexts/GlobalContext";

export default function Loading() {
  const loadingMessage = useGlobalStore((state) => state.loadingMessage);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <span className="loader"></span>
      <p className="mt-10 text-lg font-semibold">{loadingMessage}</p>
    </div>
  );
}
