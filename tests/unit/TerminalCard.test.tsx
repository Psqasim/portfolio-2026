import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { TerminalCard } from "@/components/ui/TerminalCard";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

describe("TerminalCard", () => {
  it("renders all four agent log lines immediately when prefers-reduced-motion=reduce", () => {
    render(<TerminalCard />);
    expect(screen.getByText(/Incoming ticket via WhatsApp/i)).toBeInTheDocument();
    expect(screen.getByText(/Routing to TroubleshootSkill/i)).toBeInTheDocument();
    expect(screen.getByText(/Querying knowledge base/i)).toBeInTheDocument();
    expect(screen.getByText(/Resolution time: 4\.2s/i)).toBeInTheDocument();
  });
});
