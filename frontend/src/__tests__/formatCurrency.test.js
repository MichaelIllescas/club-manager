import { describe, expect, it } from "vitest";
import { formatCurrency, formatNumber } from "../Utils/formatCurrency";

describe("formatearNumero", () => {
  it("usa punto para miles y coma para decimales", () => {
    expect(formatNumber(13531750)).toBe("13.531.750,00");
  });

  it("acepta números como texto", () => {
    expect(formatNumber("1500.5")).toBe("1.500,50");
  });

  it("devuelve cero para valores no numéricos", () => {
    expect(formatNumber("abc")).toBe("0,00");
    expect(formatNumber(undefined)).toBe("0,00");
  });
});

describe("formatearMoneda", () => {
  it("antepone el signo pesos", () => {
    expect(formatCurrency(2500)).toBe("$2.500,00");
  });
});
