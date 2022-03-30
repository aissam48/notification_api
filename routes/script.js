const express = require('express')
const router = express.Router()

router.use('/scriptwarning', require('../controllers/script/scriptwarning'))

module.exports = router