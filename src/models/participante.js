const mongoose = require('mongoose');

const ParticipanteSchema = new mongoose.Schema({
  nome_reduzido: String,
  ispb: { type: String, unique: true, index: true },
  cnpj: String,
  tipo_de_instituicao: String,
  autorizada_bcb: String,
  tipo_de_participacao_no_spi: String,
  tipo_de_participacao_no_pix: String,
  modalidade_de_participacao_no_pix: String,
  iniciacao_de_transacao_de_pagamento: String,
  facilitador_de_servico_de_saque_e_troco: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'participantes-pix' });

module.exports = mongoose.model('Participante', ParticipanteSchema);
