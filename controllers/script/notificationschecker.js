const express = require('express')
const router = express.Router()
const mariadb = require('../../lib/mariadb').mariadb
const firebaseAdmin = require('../../lib/firebase').firebaseAdmin
require('dotenv').config()

router.post('/', (req, res) => {

    const data = req.body
    const device_token = data.token
    const notification_id = data.notification_id

    const command = 'UPDATE notifications_checker_table SET statue=? WHERE notification_id=? AND device_token=?'
    mariadb.then((pool) => {

        pool.query(command, ['Received', notification_id, device_token]).then((resQuery) => {

            const commandSelect = 'SELECT * FROM notifications_checker_table WHERE statue=? AND device_token=?'
            pool.query(commandSelect, ['unReceived', device_token])
        })
    })
})

module.exports = router
