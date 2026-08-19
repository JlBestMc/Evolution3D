import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import TimelineUI from "@/features/timeline/components/ui/TimelineUI";

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.search}</output>;
}

function TimelineHarness() {
  const [currentEra, setCurrentEra] = useState("precambrian");
  const [currentSubera, setCurrentSubera] = useState<string | null>("hadean");

  return (
    <MemoryRouter>
      <TimelineUI
        currentEra={currentEra}
        setCurrentEra={(eraId) => {
          setCurrentEra(eraId);
          const firstSubera = {
            paleozoic: "cambrian",
            mesozoic: "triassic",
            cenozoic: "paleogene",
            precambrian: "hadean",
          }[eraId];
          setCurrentSubera(firstSubera ?? null);
        }}
        currentSubera={currentSubera}
        setCurrentSubera={setCurrentSubera}
      />
      <LocationProbe />
    </MemoryRouter>
  );
}

describe("TimelineUI", () => {
  it("selects a subera and replaces it when the era changes", () => {
    render(<TimelineHarness />);

    expect(screen.getByRole("article", { name: /hadean overview/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /archean, 4000/i }));

    expect(screen.getByRole("article", { name: /archean overview/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /paleozoic era: life moves ashore/i }));

    expect(screen.getByRole("article", { name: /cambrian overview/i })).toBeInTheDocument();
    expect(screen.queryByRole("article", { name: /archean overview/i })).not.toBeInTheDocument();
  });

  it("includes the selected subera in the Explore route", () => {
    render(<TimelineHarness />);

    fireEvent.click(screen.getByRole("button", { name: /explore hadean/i }));

    expect(screen.getByTestId("location")).toHaveTextContent("/era/precambrian?subera=hadean");
  });
});
