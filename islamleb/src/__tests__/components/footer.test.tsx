import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/footer";

describe("Footer", () => {
  it("renders site name", () => {
    render(<Footer />);
    expect(screen.getByText("إسلام لبنان")).toBeInTheDocument();
  });

  it("renders Ramadan greeting", () => {
    render(<Footer />);
    expect(screen.getByText("رمضان كريم - تقبل الله منا ومنكم")).toBeInTheDocument();
  });

  it("renders copyright", () => {
    render(<Footer />);
    expect(screen.getByText("إسلام لبنان © ٢٠٢٦ - صدقة جارية")).toBeInTheDocument();
  });
});
