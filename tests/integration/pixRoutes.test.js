const request = require('supertest');
const { app } = require('../../src/index');
const Participante = require('../../src/models/participante');

jest.mock('../../src/database', () => jest.fn());
jest.mock('../../src/seed', () => jest.fn());
jest.mock('../../src/models/participante');

describe('Testes de Integração: PIX Routes', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /participants/:ispb deve retornar dados do participante', async () => {
    const ispb = '98765432';
    const mockData = { ispb, nome: 'Banco Integracao' };

    Participante.findOne.mockResolvedValue(mockData);

    const response = await request(app).get(`/pix/participants/${ispb}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
    expect(Participante.findOne).toHaveBeenCalledWith({ ispb });
  });

  test('GET /participants/:ispb deve retornar 404 quando não encontrado', async () => {
    const ispb = 'nonexistent';

    Participante.findOne.mockResolvedValue(null);

    const response = await request(app).get(`/pix/participants/${ispb}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Instituição financeira não encontrada' });
  });

  test('GET /participants/:ispb deve tratar erros do servidor', async () => {
    const ispb = 'crash';

    Participante.findOne.mockRejectedValue(new Error('DB Error'));

    const response = await request(app).get(`/pix/participants/${ispb}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Erro interno do servidor' });
  });
});
