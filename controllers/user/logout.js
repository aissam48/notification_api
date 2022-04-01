const express = require('express')
const router = express.Router()

/*endpoint: /logout, methode: POST */
router.post('/', async (req, res) => {

    const pool = require('../../config/mariadb').pool
    const token = req.headers['authorization']
    const command = 'UPDATE login_table SET token=? WHERE token=?'

    switch (token) {
        case undefined: {
            res.json({
                success: false,
                message: 'token does not deleted'
            })
        }
        default: {
            /*set empty value for token for logout */
            pool.query(command, ['', token.replace('bearer ', '')]).then((resQuery) => {
                /* handle if value of token has changed to empty value */
                switch (resQuery.affectedRows) {
                    case 0: {
                        res.json({
                            success: false,
                            message: 'token does not deleted'
                        })
                    }
                    case 1: {
                        res.json({
                            success: true,
                            message: 'token has deleted'
                        })
                    }
                }
            }).catch((err) => {
                res.json({
                    success: false,
                    message: 'token does not deleted'
                })
            })
        }
    }
    console.log(token)
})
module.exports = router