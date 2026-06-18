import { jest } from "@jest/globals";

const mockFindByIdAndUpdateSolicitud = jest.fn();
const mockUpdateMany = jest.fn();

const mockFindByIdAndUpdateGato = jest.fn();

const mockCommitTransaction = jest.fn();
const mockAbortTransaction = jest.fn();
const mockEndSession = jest.fn();

const mockSession = {
  startTransaction: jest.fn(),
  commitTransaction: mockCommitTransaction,
  abortTransaction: mockAbortTransaction,
  endSession: mockEndSession,
};

jest.unstable_mockModule("../models/Gato.js", () => ({
  default: {
    startSession: jest.fn(() => mockSession),
    findByIdAndUpdate: mockFindByIdAndUpdateGato,
  },
}));

jest.unstable_mockModule("../models/Solicitud.js", () => ({
  default: {
    findByIdAndUpdate: mockFindByIdAndUpdateSolicitud,
    updateMany: mockUpdateMany,
  },
}));

const { updateEstadoSolicitud } = await import(
  "../controllers/solicitudController.js"
);

describe("updateEstadoSolicitud", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe aprobar la solicitud y marcar al gato como adoptado", async () => {
    mockFindByIdAndUpdateSolicitud.mockResolvedValue({
      _id: "sol123",
      gato: "gato123",
    });

    const req = {
      params: {
        id: "507f191e810c19729de860ea",
      },
      body: {
        estadoSolicitud: "Aprobada",
      },
    };

    const json = jest.fn();

    const res = {
      status: jest.fn(() => ({
        json,
      })),
    };

    await updateEstadoSolicitud(req, res);

    expect(mockFindByIdAndUpdateGato).toHaveBeenCalled();

    expect(mockUpdateMany).toHaveBeenCalled();

    expect(mockCommitTransaction).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
  });
});