import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useScrollSpy } from "@/lib/useScrollSpy";

type ObserverCallback = (entries: IntersectionObserverEntry[]) => void;

class MockObserver implements IntersectionObserver {
  static latest: MockObserver | null = null;
  root: Element | null = null;
  rootMargin = "";
  thresholds: ReadonlyArray<number> = [];
  callback: ObserverCallback;
  targets = new Set<Element>();

  constructor(cb: IntersectionObserverCallback) {
    this.callback = cb as unknown as ObserverCallback;
    MockObserver.latest = this;
  }
  observe(el: Element): void {
    this.targets.add(el);
  }
  unobserve(el: Element): void {
    this.targets.delete(el);
  }
  disconnect(): void {
    this.targets.clear();
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  fire(partial: Array<{ id: string; ratio: number; intersecting: boolean }>) {
    const entries = partial.map((p) => {
      const target = document.getElementById(p.id)!;
      return {
        target,
        intersectionRatio: p.ratio,
        isIntersecting: p.intersecting,
      } as unknown as IntersectionObserverEntry;
    });
    this.callback(entries);
  }
}

describe("useScrollSpy", () => {
  beforeEach(() => {
    ["home", "systems", "skills"].forEach((id) => {
      const el = document.createElement("section");
      el.id = id;
      document.body.appendChild(el);
    });
    vi.stubGlobal("IntersectionObserver", MockObserver);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
    MockObserver.latest = null;
  });

  it("returns the most-visible section id as active", () => {
    const { result } = renderHook(() => useScrollSpy(["home", "systems", "skills"]));
    expect(result.current).toBeNull();

    act(() => {
      MockObserver.latest!.fire([
        { id: "home", ratio: 0.2, intersecting: true },
        { id: "systems", ratio: 0.8, intersecting: true },
      ]);
    });
    expect(result.current).toBe("systems");

    act(() => {
      MockObserver.latest!.fire([
        { id: "skills", ratio: 0.9, intersecting: true },
      ]);
    });
    expect(result.current).toBe("skills");
  });
});
