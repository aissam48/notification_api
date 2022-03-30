const express = require('express')
const router = express.Router()

/*endpoint: /logout, methode: POST */
router.post('/', async (req, res) => {

    const pool = require('../../config/mariadb').pool
    const token = req.headers['authorization']
    const command = 'UPDATE login_table SET token=? WHERE token=?'

    /*set empty value for token for logout */
    pool.query(command, ['', token]).then((resQuery) => {
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