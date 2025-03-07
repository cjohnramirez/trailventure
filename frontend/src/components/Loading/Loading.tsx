import "./Loading.css"
import { useGetStore } from "../Contexts/AuthContext";

export default function Loading() {
  const loadingMessage = useGetStore((state) => state.loadingMessage);

  return (
    <div className="select-none flex h-screen w-screen flex-col items-center justify-center">
      <span className="loader"></span>
      <p className="mt-10 text-lg font-semibold">{loadingMessage}</p>
    </div>
  );
}
