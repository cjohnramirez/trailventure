import { ModeToggle } from "../components/mode-toggle";
import { Button } from "../components/ui/button";

function Home() {
  return (
    <div className="w-full flex h-screen justify-center items-center gap-2">
      <Button variant="outline">Wawww nakasulod cya</Button>
      <ModeToggle />
    </div>
  )
}

export default Home;