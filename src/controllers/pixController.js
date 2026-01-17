const Participante = require('../models/participante');
const cacheService = require('../services/cacheService');

const CACHE_TTL = process.env.CACHE_TTL;

const getParticipantByIspb = async (req, res) => {
  const { ispb } = req.params;

  try {
    const cachedData = cacheService.get(ispb);
    if (cachedData) {
      return res.json(cachedData);
    }

    const participant = await Participante.findOne({ ispb });

    if (!participant) {
      return res.status(404).json({ error: 'Instituição financeira não encontrada' });
    }

    cacheService.set(ispb, participant, CACHE_TTL);

    return res.json(participant);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getParticipantByIspb
};
