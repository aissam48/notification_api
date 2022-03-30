const express = require('express')
const router = express.Router()

router.use('/getnotifications', require('../controllers/user/getnotifications'))
router.use('/getprojects', require('../controllers/user/getprojects'))
router.use('/login', require('../controllers/user/login'))
router.use('/logout', require('../controllers/user/logout'))
router.use('/notificationsreaders', require('../controllers/user/notificationsreaders'))

module.exports = router






