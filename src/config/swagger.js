const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API do PIX',
      version: '1.0.0',
      description: 'API para consulta de participantes do PIX.',
    },
    servers: [
      {
        url: 'http://localhost:3000'
      },
    ],
    components: {
      schemas: {
        Participante: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'ID interno do banco de dados' },
            nome_reduzido: { type: 'string', description: 'Nome reduzido do participante' },
            ispb: { type: 'string', description: 'Código ISPB' },
            cnpj: { type: 'string', description: 'CNPJ do participante' },
            tipo_de_instituicao: { type: 'string', description: 'Tipo de instituição' },
            autorizada_bcb: { type: 'string', description: 'Autorizada pelo BCB' },
            tipo_de_participacao_no_spi: { type: 'string', description: 'Tipo de participação no SPI' },
            tipo_de_participacao_no_pix: { type: 'string', description: 'Tipo de participação no PIX' },
            modalidade_de_participacao_no_pix: { type: 'string', description: 'Modalidade de participação no PIX' },
            iniciacao_de_transacao_de_pagamento: { type: 'string', description: 'Iniciação de transação de pagamento' },
            facilitador_de_servico_de_saque_e_troco: { type: 'string', description: 'Facilitador de serviço de saque e troco' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', description: 'Mensagem de erro' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
