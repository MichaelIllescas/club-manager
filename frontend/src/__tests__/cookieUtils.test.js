import { afterEach, describe, expect, it } from "vitest";
import { getCookie } from "../Auth/cookieUtils";

describe("getCookie", () => {
  afterEach(() => {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "tema=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  });

  it("devuelve el valor de la cookie pedida", () => {
    document.cookie = "tema=oscuro";
    document.cookie = "authToken=abc123";
    expect(getCookie("authToken")).toBe("abc123");
  });

  it("devuelve null si la cookie no existe", () => {
    expect(getCookie("inexistente")).toBeNull();
  });
});
