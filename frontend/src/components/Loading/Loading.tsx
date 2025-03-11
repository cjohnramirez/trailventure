import "./Loading.css"

interface LoadingProps {
  loadingMessage: string;
}

export default function Loading({ loadingMessage }: LoadingProps) {
  return (
    <div className="select-none flex h-screen w-screen flex-col items-center justify-center">
      <span className="loader"></span>
      <p className="mt-10 text-lg font-semibold">{loadingMessage}</p>
    </div>
  );
}
