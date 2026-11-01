import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import TableGeneric from "../Components/TableGeneric";

const members = Array.from({ length: 12 }, (_, i) => ({
  firstName: `Socio ${String(i + 1).padStart(2, "0")}`,
  dni: `3000000${i}`,
}));

describe("TableGeneric", () => {
  afterEach(cleanup);

  it("muestra un aviso cuando no hay datos", () => {
    render(<TableGeneric data={[]} />);
    expect(screen.getByText("Todavía no hay registros.")).toBeTruthy();
  });

  it("pagina de a 10 filas", () => {
    render(<TableGeneric data={members} />);
    expect(screen.getByText("Socio 01")).toBeTruthy();
    expect(screen.queryByText("Socio 11")).toBeNull();
    expect(screen.getByText(/Página 1 de 2/)).toBeTruthy();
  });

  it("filtra las filas con el buscador", () => {
    render(<TableGeneric data={members} />);
    fireEvent.change(screen.getByPlaceholderText("Buscar en la tabla..."), {
      target: { value: "Socio 12" },
    });
    expect(screen.getByText("Socio 12")).toBeTruthy();
    expect(screen.queryByText("Socio 01")).toBeNull();
  });

  it("ejecuta la acción con la fila correspondiente", () => {
    const edit = vi.fn();
    render(<TableGeneric data={members.slice(0, 1)} actions={[{ label: "Editar", onClick: edit }]} />);
    fireEvent.click(screen.getByText("Editar"));
    expect(edit).toHaveBeenCalledWith(members[0]);
  });
});

describe("TableGeneric con datos que llegan después", () => {
  afterEach(cleanup);

  it("pasa de vacía a tener datos sin romperse", () => {
    const { rerender } = render(<TableGeneric data={[]} />);
    expect(screen.getByText("Todavía no hay registros.")).toBeTruthy();

    rerender(<TableGeneric data={members} />);
    expect(screen.getByText("Socio 01")).toBeTruthy();
  });

  it("oculta una columna al destildarla", () => {
    render(<TableGeneric data={members.slice(0, 1)} />);
    fireEvent.click(screen.getByLabelText("DNI"));
    expect(screen.queryByText("30000000")).toBeNull();
  });
});
