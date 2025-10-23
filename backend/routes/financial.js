const express = require('express');
const router = express.Router();
const financialController = require('../controllers/financialController');

router.get('/', financialController.getFinancialOperations);
router.post('/', financialController.createFinancialOperation);

module.exports = router;