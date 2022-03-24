const express = require('express')
const bcrypt = require('bcrypt')
const uuid = require('uuid')

const router = express.Router()


router.post('/', async (req, res) => {

    const data = req.body
    const time = data.time
    const pool = require('./App').mariadb

    const command = 'SELECT * FROM notifications_table WHERE dateFilter>=$time'.replace('$time', time)

    pool.query(command).then((resQuery) => {

        res.json({
            statue: true,
            result: resQuery
        })

    }).catch((err) => {

        res.json({
            statue: false
        })

    })

})


module.exports = router