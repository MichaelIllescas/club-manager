import { describe, expect, it } from "vitest";
import { formatearMoneda, formatearNumero } from "../Utils/formatearMoneda";

describe("formatearNumero", () => {
  it("usa punto para miles y coma para decimales", () => {
    expect(formatearNumero(13531750)).toBe("13.531.750,00");
  });

  it("acepta números como texto", () => {
    expect(formatearNumero("1500.5")).toBe("1.500,50");
  });

  it("devuelve cero para valores no numéricos", () => {
    expect(formatearNumero("abc")).toBe("0,00");
    expect(formatearNumero(undefined)).toBe("0,00");
  });
});

describe("formatearMoneda", () => {
  it("antepone el signo pesos", () => {
    expect(formatearMoneda(2500)).toBe("$2.500,00");
  });
});
