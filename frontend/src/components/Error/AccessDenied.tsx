import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full items-center justify-center gap-2">
      <div className="flex-row">
        <p className="pb-4 text-center text-2xl font-bold">
          Error: You Must Login to Access This Page
        </p>
        <div className="flex gap-2 justify-center">
          <Button variant="outline">You Seemed Lost</Button>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
      </div>
    </div>
  );
}
export default AccessDenied;
