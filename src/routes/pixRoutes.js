const express = require('express');
const router = express.Router();
const pixController = require('../controllers/pixController');

router.get('/participants/:ispb', pixController.getParticipantByIspb);

module.exports = router;
