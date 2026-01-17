const pixController = require('../../src/controllers/pixController');
const Participante = require('../../src/models/participante');
const cacheService = require('../../src/services/cacheService');

jest.mock('../../src/models/participante');
jest.mock('../../src/services/cacheService');

describe('PixController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {} };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  test('deve retornar dados do participante se disponível', async () => {
    const ispb = '12345678';
    const cachedData = { nome: 'Banco Teste', ispb };

    req.params.ispb = ispb;
    cacheService.get.mockReturnValue(cachedData);

    await pixController.getParticipantByIspb(req, res);

    expect(cacheService.get).toHaveBeenCalledWith(ispb);
    expect(Participante.findOne).not.toHaveBeenCalled();
    expect(res.statusCode).toBeUndefined();
    expect(res.json).toHaveBeenCalledWith(cachedData);
  });

  test('deve buscar do banco de dados se não estiver em cache', async () => {
    const ispb = '87654321';
    const dbData = { nome: 'Banco DB', ispb };

    req.params.ispb = ispb;
    cacheService.get.mockReturnValue(null);
    Participante.findOne.mockResolvedValue(dbData);

    await pixController.getParticipantByIspb(req, res);

    expect(cacheService.get).toHaveBeenCalledWith(ispb);
    expect(Participante.findOne).toHaveBeenCalledWith({ ispb });
    expect(cacheService.set).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(dbData);
  });

  test('deve retornar 404 se não encontrado no banco de dados', async () => {
    const ispb = '00000000';

    req.params.ispb = ispb;
    cacheService.get.mockReturnValue(null);
    Participante.findOne.mockResolvedValue(null);

    await pixController.getParticipantByIspb(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Instituição financeira não encontrada' });
  });

  test('deve retornar 500 em caso de erro do servidor', async () => {
    const ispb = 'error';

    req.params.ispb = ispb;
    cacheService.get.mockImplementation(() => { throw new Error('Cache Error'); });

    await pixController.getParticipantByIspb(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno do servidor' });
  });
});
