var express = require('express');
var router = express.Router();
const role = require('../controllers/roles')

router.post('/', role.createRole)

module.exports = router;