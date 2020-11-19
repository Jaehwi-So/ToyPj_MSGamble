const express = require('express');
const router = express.Router();
const controller = require('../controller/page')

router.use(controller.all_request_bind);

module.exports = router;