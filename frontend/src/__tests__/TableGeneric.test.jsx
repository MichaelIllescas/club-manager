import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import TableGeneric from "../Components/TableGeneric";

const socios = Array.from({ length: 12 }, (_, i) => ({
  nombre: `Socio ${String(i + 1).padStart(2, "0")}`,
  dni: `3000000${i}`,
}));

describe("TableGeneric", () => {
  afterEach(cleanup);

  it("muestra un aviso cuando no hay datos", () => {
    render(<TableGeneric data={[]} />);
    expect(screen.getByText("No se encontraron datos disponibles.")).toBeTruthy();
  });

  it("pagina de a 10 filas", () => {
    render(<TableGeneric data={socios} />);
    expect(screen.getByText("Socio 01")).toBeTruthy();
    expect(screen.queryByText("Socio 11")).toBeNull();
    expect(screen.getByText(/Página 1 de 2/)).toBeTruthy();
  });

  it("filtra las filas con el buscador", () => {
    render(<TableGeneric data={socios} />);
    fireEvent.change(screen.getByPlaceholderText("Buscar en la tabla..."), {
      target: { value: "Socio 12" },
    });
    expect(screen.getByText("Socio 12")).toBeTruthy();
    expect(screen.queryByText("Socio 01")).toBeNull();
  });

  it("ejecuta la acción con la fila correspondiente", () => {
    const editar = vi.fn();
    render(<TableGeneric data={socios.slice(0, 1)} actions={[{ label: "Editar", onClick: editar }]} />);
    fireEvent.click(screen.getByText("Editar"));
    expect(editar).toHaveBeenCalledWith(socios[0]);
  });
});
