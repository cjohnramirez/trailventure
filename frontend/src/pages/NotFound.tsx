import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex justify-center items-center gap-2">
      <div className="flex-row">
        <p className="text-center font-bold text-2xl pb-4">Error: 404 Not Found</p>
        <div className="flex gap-2">
          <Button variant="outline">You Seemed Lost</Button>
          <Button onClick={() => navigate("/")}>Return!</Button>
        </div>
      </div>
    </div>
  );
}
export default NotFound;
