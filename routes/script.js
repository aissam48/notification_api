const express = require('express')
const router = express.Router()

router.use('/scriptwarning', require('../controllers/script/scriptwarning'))
router.use('/notificationschecker', require('../controllers/script/notificationschecker'))

module.exports = router