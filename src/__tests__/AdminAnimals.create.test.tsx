import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnimalsAdmin from "@/pages/adminPage/AnimalsAdmin";

// Supabase mock (simple): captura insert y devuelve listas vacías
vi.mock("@/lib/supabaseClient", () => {
  const state = { lastInsert: undefined as unknown };
  const insert = vi.fn((payload: unknown) => {
    state.lastInsert = payload;
    return {
      select: () => ({
        single: () => Promise.resolve({ data: {}, error: null }),
      }),
    };
  });
  const from = vi.fn(() => ({
    select: vi.fn().mockResolvedValue({ data: [], error: null, count: 0 }),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    insert,
  }));
  return {
    supabase: { from },
    __mock: {
      getLastInsert: () => state.lastInsert,
      reset: () => (state.lastInsert = undefined),
    },
  };
});

// Componentes pesados: mocks livianos
vi.mock("@/components/admin/UploadModelField", () => ({
  default: ({ onUploaded }: { onUploaded: (url: string) => void }) => (
    <button onClick={() => onUploaded("https://example.com/model.glb")}>
      MockUpload
    </button>
  ),
}));
vi.mock("@/components/admin/AdminHeader", () => ({ default: () => <div /> }));
vi.mock("@/components/admin/AdminCharts", () => ({ default: () => <div /> }));

describe("AnimalsAdmin casos simples", () => {
  it("abre el modal de creación", async () => {
    render(<AnimalsAdmin />);
    await userEvent.click(
      await screen.findByRole("button", { name: /new animal/i })
    );
    expect(
      await screen.findByRole("button", { name: /create$/i })
    ).toBeInTheDocument();
  });

  it("guarda con campos mínimos y llama a insert", async () => {
    const mod = (await import("@/lib/supabaseClient")) as unknown as {
      __mock: { reset: () => void; getLastInsert: () => unknown };
    };
    mod.__mock.reset();
    render(<AnimalsAdmin />);
    await userEvent.click(
      await screen.findByRole("button", { name: /new animal/i })
    );
    await userEvent.type(await screen.findByLabelText(/name/i), "Test Dino");
    await userEvent.selectOptions(
      await screen.findByLabelText(/era/i),
      "7809661c-0b73-48f6-9c52-7e05b2e80cba"
    );
    await userEvent.click(
      await screen.findByRole("button", { name: /create$/i })
    );
    expect(mod.__mock.getLastInsert()).toBeTruthy();
  });
});
