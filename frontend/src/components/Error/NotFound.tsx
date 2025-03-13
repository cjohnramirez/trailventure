import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex h-dvh w-full items-center justify-center gap-2">
      <div className="flex-row">
        <p className="pb-4 text-center text-2xl font-bold">
          Error: 404 Not Found
        </p>
        <div className="flex gap-2">
          <Button variant="outline">You Seemed Lost</Button>
          <Button onClick={() => navigate("/")}>Return!</Button>
        </div>
      </div>
    </div>
  );
}
export default NotFound;
