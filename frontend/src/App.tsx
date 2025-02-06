import "./App.css";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";

function App() {
  return (
    <div className="w-full flex h-screen justify-center items-center gap-2">
      <Button variant="outline">Click the button on the right</Button>
      <ModeToggle />
    </div>
  );
}

export default App;
