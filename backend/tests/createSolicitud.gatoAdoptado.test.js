import { jest } from "@jest/globals";

const mockFindById = jest.fn();

jest.unstable_mockModule("../models/Gato.js", () => ({
  default: {
    findById: mockFindById,
  },
}));

jest.unstable_mockModule("../models/Solicitud.js", () => ({
  default: {},
}));

const { createSolicitud } = await import(
  "../controllers/solicitudController.js"
);

describe("createSolicitud", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe impedir solicitudes para gatos adoptados", async () => {
    mockFindById.mockResolvedValue({
      _id: "gato123",
      estadoAdopcion: "Adoptado",
    });

    const req = {
      body: {
        gato: "gato123",
        motivo: "Quiero adoptarlo",
        telefonoContacto: "12345678",
      },
      user: {
        _id: "usuario123",
      },
    };

    const json = jest.fn();

    const res = {
      status: jest.fn(() => ({
        json,
      })),
    };

    await createSolicitud(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(json).toHaveBeenCalledWith({
      message: "Este michi ya fue adoptado",
    });
  });
});