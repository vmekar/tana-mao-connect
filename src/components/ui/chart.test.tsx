import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { ChartContainer } from "./chart";

describe("Chart Container and ChartStyle Security", () => {
  beforeAll(() => {
    // Mock ResizeObserver for Recharts
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it("should safely encode malicious input to prevent XSS", () => {
    // Malicious config trying to break out of <style> tag
    // Testing both key and color values
    const maliciousConfig = {
      attack: {
        label: "Attack",
        color: "</style><script>alert('XSS')</script>",
      },
      "</style><script>alert('XSS-KEY')</script>": {
        label: "Attack2",
        color: "red",
      }
    };

    const { container } = render(
      <ChartContainer config={maliciousConfig} id="test-xss">
        <div data-testid="chart-content">Chart</div>
      </ChartContainer>
    );

    // We can verify that no script elements were injected into the container.
    const scripts = container.querySelectorAll("script");
    expect(scripts.length).toBe(0);

    const styleEl = container.querySelector("style");
    expect(styleEl).not.toBeNull();
    // Verify the malicious characters were stripped out during sanitization
    const html = styleEl?.innerHTML || "";
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("</style>");
    expect(html).toContain("--color-attack: /stylescriptalert('XSS')/script"); // stripped payload
    expect(html).toContain("--color-/stylescriptalert('XSS-KEY')/script: red"); // stripped key
  });
});
