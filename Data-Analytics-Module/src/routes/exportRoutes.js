const router = require('express').Router();
const controller = require('../controllers/exportController');

router.get('/csv', controller.exportCsv);
router.get('/pdf', controller.exportPdf);

module.exports = router;
