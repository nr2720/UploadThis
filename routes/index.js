var express = require('express');
var router = express.Router();

const indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexController.indexGet);


// Get home page logged
router.get('/auth', indexController.indexGetAuth);




module.exports = router;
