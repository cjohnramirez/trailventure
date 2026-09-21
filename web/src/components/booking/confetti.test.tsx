import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useConfetti } from "./confetti";

const confetti = vi.hoisted(() => vi.fn());
vi.mock("canvas-confetti", () => ({ default: confetti }));

function Burst({ active }: { active: boolean }) {
  useConfetti(active);
  return null;
}

function setReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches: reduce }) as unknown as typeof matchMedia;
}

describe("useConfetti", () => {
  beforeEach(() => {
    confetti.mockClear();
    setReducedMotion(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fires once when the booking becomes confirmed", async () => {
    const { rerender } = render(<Burst active={false} />);
    expect(confetti).not.toHaveBeenCalled();

    rerender(<Burst active />);
    await vi.waitFor(() => expect(confetti).toHaveBeenCalledTimes(1));

    rerender(<Burst active={false} />);
    rerender(<Burst active />);
    expect(confetti).toHaveBeenCalledTimes(1);
  });

  it("stays still when the visitor asked for reduced motion", async () => {
    setReducedMotion(true);
    render(<Burst active />);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(confetti).not.toHaveBeenCalled();
  });
});
