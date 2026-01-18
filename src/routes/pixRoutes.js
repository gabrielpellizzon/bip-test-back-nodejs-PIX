const express = require('express');
const router = express.Router();
const pixController = require('../controllers/pixController');

/**
 * @swagger
 * /pix/participants/{ispb}:
 *   get:
 *     summary: Retorna informações de um participante do PIX pelo ISPB
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: ispb
 *         schema:
 *           type: string
 *         required: true
 *         description: Código ISPB do participante
 *     responses:
 *       200:
 *         description: Dados do participante encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participante'
 *       404:
 *         description: Participante não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/participants/:ispb', pixController.getParticipantByIspb);

module.exports = router;
