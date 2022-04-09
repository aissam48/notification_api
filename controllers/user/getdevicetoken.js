const express = require('express')
const router = express.Router()
const mariadb = require('../../lib/mariadb').mariadb

router.post('/', (req, res) => {

    const data = req.body
    const devicetoken = data.token
    const username = data.username
    console.log(data)

    const command = 'UPDATE login_table SET device_token=? WHERE username=?'
    mariadb.then((pool) => {
        pool.query(command, [devicetoken, username])
        const commandGetAllDeviceTokens = 'UPDATE notifications_checker_table SET device_token=? WHERE username=?'
        pool.query(commandGetAllDeviceTokens, [devicetoken, username])
    })

})

module.exports = router