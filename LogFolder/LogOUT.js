const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()


router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.post('/', async (req, res) => {

    const pool = require('./App').mariadb
    const data = req.body
    const username = data.username

    const command = 'UPDATE login_table SET token="$token" WHERE username="$username"'
        .replace('$token', '')
        .replace('$username', username)

    pool.query(command).then((resQuery) => {
        console.log(resQuery)
        res.json({
            success: true,
            message: 'token has deleted'
        })
    }).catch((err) => {
        res.json({
            success: false,
            message: 'token does not deleted'
        })
    })

})

module.exports = router