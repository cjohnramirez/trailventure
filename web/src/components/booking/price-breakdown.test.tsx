import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PriceBreakdown } from "./price-breakdown";

const amounts = {
  guests: 2,
  base_amount: 2_400_000,
  site_fee_amount: 480_000,
  tax_amount: 288_000,
  total_amount: 3_168_000,
  tax_percent: "12.00",
  site_fee_percent: "20.00",
};

describe("PriceBreakdown", () => {
  it("shows the server's amounts in pesos", () => {
    render(<PriceBreakdown amounts={amounts} />);

    expect(screen.getByText("× 2")).toBeInTheDocument();
    expect(screen.getByText("₱24,000")).toBeInTheDocument();
    expect(screen.getByText("₱4,800")).toBeInTheDocument();
    expect(screen.getByText("₱2,880")).toBeInTheDocument();
    expect(screen.getByText("₱31,680")).toBeInTheDocument();
  });

  it("labels each fee with the percentage it came from", () => {
    render(<PriceBreakdown amounts={amounts} />);

    expect(screen.getByText("20% of the base price")).toBeInTheDocument();
    expect(screen.getByText("Includes VAT and tourism tax (12%)")).toBeInTheDocument();
  });
});
